import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Checklist, ChecklistItem, Bag, Category } from '../types';
import { getTranslatedItemName, getTranslatedCategory, getTranslatedTemplateName } from '../i18n/contentTranslations';
import { calculateProgress, calculateBagProgress, groupItemsByCategory, type CategoryWithItems } from '../services/checklistService';
import { extractCategories } from '../services/categoryService';

interface FinalCheckItem {
  id: string;
  label: string;
  icon: string;
}

interface ExportPDFOptions {
  checklist: Checklist;
  items: ChecklistItem[];
  bags: Bag[];
  finalCheckItems: FinalCheckItem[];
  finalCheckState: Record<string, boolean>;
  lang: string;
  t: any;
}

/**
 * Generate and download a PDF of the checklist
 */
export async function exportChecklistPDF(options: ExportPDFOptions): Promise<void> {
  const { checklist, items, bags, finalCheckItems, finalCheckState, lang, t } = options;
  
  // Create a hidden container for rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96dpi
  container.style.background = '#ffffff';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.style.color = '#111827';
  
  const progress = calculateProgress(items);
  const categories = extractCategories(items);
  const groupedItems = groupItemsByCategory(items, categories);
  
  // Build HTML content
  let html = '';
  
  // === Header ===
  const title = checklist.titleUserModified === false && checklist.templateOriginName
    ? getTranslatedTemplateName(checklist.templateOriginName, lang)
    : checklist.title;
  
  html += `
    <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #4F6EF5;">
      <div style="font-size: 48px; margin-bottom: 12px;">${checklist.icon}</div>
      <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 8px 0; color: #111827;">${escapeHtml(title)}</h1>
      <p style="font-size: 16px; color: #6b7280; margin: 0;">
        ${formatDate(checklist.departureDate || '', lang)} · ${items.length} ${lang === 'zh' ? '件物品' : 'items'}
      </p>
    </div>
  `;
  
  // === Progress Section ===
  html += `
    <div style="margin-bottom: 32px; background: #f9fafb; border-radius: 16px; padding: 24px;">
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="flex-shrink: 0; position: relative; width: 100px; height: 100px;">
          <svg width="100" height="100" style="transform: rotate(-90deg);">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#4F6EF5" stroke-width="8" 
              stroke-linecap="round"
              stroke-dasharray="${2 * Math.PI * 40}"
              stroke-dashoffset="${2 * Math.PI * 40 - (progress.percentage / 100) * 2 * Math.PI * 40}" />
          </svg>
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 20px; font-weight: bold;">${progress.percentage}%</span>
            <span style="font-size: 10px; color: #6b7280;">${t.detail.progressLabel || 'Complete'}</span>
          </div>
        </div>
        <div style="flex: 1;">
          <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 8px 0;">${t.stats.overallProgress}</h2>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0;">${t.stats.overallDesc}</p>
          <div style="display: flex; gap: 24px; font-size: 14px;">
            <div>
              <span style="color: #6b7280;">${t.stats.packedItems}: </span>
              <span style="font-weight: 600;">${progress.packed}</span>
            </div>
            <div>
              <span style="color: #6b7280;">${t.stats.remaining}: </span>
              <span style="font-weight: 600;">${progress.total - progress.packed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // === Final Check Section ===
  if (finalCheckItems.length > 0) {
    const fcChecked = finalCheckItems.filter(item => finalCheckState[item.id]).length;
    html += `
      <div style="margin-bottom: 32px; background: linear-gradient(135deg, #fffbeb, #fff7ed); border: 1px solid #fde68a; border-radius: 16px; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #fef3c7; display: flex; align-items: center; justify-content: center; font-size: 20px;">
            ⚡
          </div>
          <div style="flex: 1;">
            <h2 style="font-size: 18px; font-weight: bold; margin: 0;">${t.detail.finalCheck}</h2>
            <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0 0;">
              ${fcChecked}/${finalCheckItems.length} ${lang === 'zh' ? '已检查' : 'checked'}
            </p>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          ${finalCheckItems.map(item => `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; background: ${finalCheckState[item.id] ? '#dcfce7' : 'rgba(255,255,255,0.8)'};">
              <span style="font-size: 16px;">${item.icon}</span>
              <span style="font-size: 13px; ${finalCheckState[item.id] ? 'text-decoration: line-through; color: #15803d;' : 'color: #374151;'}">${escapeHtml(item.label)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // === Items by Category ===
  html += `<h2 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #111827;">${t.stats.itemsByCategory}</h2>`;
  
  const groupedItemsArr: CategoryWithItems[] = groupedItems as any;
  
  for (const catGroup of groupedItemsArr) {
    const translatedCatName = getTranslatedCategory(catGroup.name, lang);
    const catColor = getCategoryColor(catGroup.name);
    const packedCount = catGroup.items.filter(i => i.packed).length;
    const catIcon = getCategoryIconById(catGroup.id, categories);
    
    html += `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: ${catColor.bg}; border: 1px solid ${catColor.border}; display: flex; align-items: center; justify-content: center; font-size: 14px;">
            ${catIcon}
          </div>
          <h3 style="font-size: 15px; font-weight: 600; margin: 0; flex: 1;">${escapeHtml(translatedCatName)}</h3>
          <span style="font-size: 12px; color: #6b7280;">${packedCount}/${catGroup.items.length}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; padding-left: 38px;">
          ${catGroup.items.map(item => {
            const itemName = item.isTemplateItem 
              ? getTranslatedItemName(item.name, lang) 
              : item.name;
            return `
              <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; line-height: 1.4;">
                <span style="display: inline-block; width: 16px; height: 16px; border-radius: 4px; border: 2px solid ${item.packed ? '#22c55e' : '#d1d5db'}; background: ${item.packed ? '#22c55e' : 'transparent'}; text-align: center; line-height: 12px; font-size: 10px; color: white; flex-shrink: 0;">
                  ${item.packed ? '✓' : ''}
                </span>
                <span style="color: #374151; flex: 1;">${escapeHtml(itemName)}</span>
                ${item.quantity > 1 ? `<span style="color: #9ca3af; font-size: 12px; flex-shrink: 0;">×${item.quantity}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  // === Bags Section ===
  if (bags.length > 0) {
    html += `
      <div style="margin-top: 32px; page-break-before: auto;">
        <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #111827;">${t.detail.bags || 'Bags'}</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    `;
    
    for (const bag of bags) {
      const bagItems = items.filter(i => i.bagId === bag.id);
      const bagProgress = calculateBagProgress(bag.id, items);
      
      html += `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; page-break-inside: avoid;">
          <div style="background: #f9fafb; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 28px;">
              ${bag.iconImage 
                ? `<img src="${bag.iconImage}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;" />` 
                : bag.icon}
            </div>
            <div style="flex: 1;">
              <p style="font-weight: 600; font-size: 14px; margin: 0;">${escapeHtml(bag.name)}</p>
              <p style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">${bagItems.length} ${bagItems.length === 1 ? (lang === 'zh' ? '件物品' : 'item') : (lang === 'zh' ? '件物品' : 'items')}</p>
            </div>
          </div>
          <div style="padding: 12px 16px;">
            ${bagItems.length === 0 
              ? `<p style="font-size: 12px; color: #9ca3af; text-align: center; padding: 8px 0;">${lang === 'zh' ? '暂无物品' : 'No items yet'}</p>`
              : `<div style="display: flex; flex-direction: column; gap: 6px;">
                  ${bagItems.map(item => {
                    const itemName = item.isTemplateItem 
                      ? getTranslatedItemName(item.name, lang) 
                      : item.name;
                    return `
                      <div style="display: flex; align-items: flex-start; gap: 6px; font-size: 12px; color: #374151; line-height: 1.4;">
                        <span style="color: #22c55e; flex-shrink: 0; line-height: 1.4;">✓</span>
                        <span style="flex: 1; word-break: break-all;">${escapeHtml(itemName)}</span>
                        ${item.quantity > 1 ? `<span style="color: #9ca3af; flex-shrink: 0;">×${item.quantity}</span>` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>`
            }
          </div>
          <!-- Progress bar -->
          <div style="height: 4px; background: #f3f4f6;">
            <div style="height: 100%; width: ${bagProgress.percentage}%; background: ${bagProgress.percentage === 100 ? '#22c55e' : '#4F6EF5'};"></div>
          </div>
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
  }
  
  // Footer
  html += `
    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af;">
      Generated by PackPack · ${new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
    </div>
  `;
  
  container.innerHTML = html;
  document.body.appendChild(container);
  
  try {
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Additional pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Filename
    const filename = `${title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}_PackPack.pdf`;
    pdf.save(filename);
    
  } finally {
    document.body.removeChild(container);
  }
}

// Helper functions
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr: string, lang: string): string {
  if (!dateStr) return lang === 'zh' ? '日期未设置' : 'No date';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCategoryColor(categoryName: string): { bg: string; border: string } {
  const colorMap: Record<string, { bg: string; border: string }> = {
    'Documents': { bg: '#dbeafe', border: '#bfdbfe' },
    'Clothing': { bg: '#fce7f3', border: '#fbcfe8' },
    'Toiletries': { bg: '#f3e8ff', border: '#e9d5ff' },
    'Essentials': { bg: '#dcfce7', border: '#bbf7d0' },
    'Electronics': { bg: '#e0e7ff', border: '#c7d2fe' },
    'Health': { bg: '#fee2e2', border: '#fecaca' },
    'Entertainment': { bg: '#ffedd5', border: '#fed7aa' },
    'Shoes': { bg: '#fef3c7', border: '#fde68a' },
    'Accessories': { bg: '#cffafe', border: '#a5f3fc' },
    'Food': { bg: '#ecfccb', border: '#d9f99d' },
    'Tools': { bg: '#f1f5f9', border: '#e2e8f0' },
    'Swimwear': { bg: '#e0f2fe', border: '#bae6fd' },
    'Sun Protection': { bg: '#fef9c3', border: '#fef08a' },
    'Beach Gear': { bg: '#ccfbf1', border: '#99f6e4' },
    'Cooking': { bg: '#ffedd5', border: '#fed7aa' },
    'Work Gear': { bg: '#f1f5f9', border: '#e2e8f0' },
    'Formal Wear': { bg: '#f3f4f6', border: '#e5e7eb' },
  };
  return colorMap[categoryName] || { bg: '#f3f4f6', border: '#e5e7eb' };
}

function getCategoryIconById(catId: string, categories: Category[]): string {
  const cat = categories.find(c => c.id === catId);
  if ((cat as any)?.icon) return (cat as any).icon;
  
  // Fallback: return a default based on category name
  const name = cat?.name || '';
  const iconMap: Record<string, string> = {
    'Documents': '📄',
    'Clothing': '👕',
    'Toiletries': '🧴',
    'Essentials': '🎒',
    'Electronics': '📱',
    'Health': '💊',
    'Entertainment': '🎮',
    'Shoes': '👟',
    'Accessories': '💍',
    'Food': '🍎',
    'Tools': '🔧',
    'Swimwear': '🩱',
    'Sun Protection': '🧴',
    'Beach Gear': '🏖️',
    'Cooking': '🍳',
    'Work Gear': '💼',
    'Formal Wear': '👔',
  };
  return iconMap[name] || '📦';
}
