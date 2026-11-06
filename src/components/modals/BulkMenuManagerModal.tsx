import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { MenuCategory, MenuItem, DietaryType } from '@/types';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  Crown, 
  Lock, 
  Sparkles,
  FileText,
  CheckCircle2,
  Table
} from 'lucide-react';

interface BulkMenuManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
}

export const BulkMenuManagerModal: React.FC<BulkMenuManagerModalProps> = ({
  isOpen,
  onClose,
  restaurantId
}) => {
  const { 
    restaurants, 
    getRestaurantCategories, 
    getRestaurantItems, 
    addRestaurantCategory, 
    addRestaurantItem 
  } = useRestaurant();

  const { canAccessFeature, openUpgradeModal, currentSubscription } = usePlan();

  const currentRest = restaurants.find(r => r.id === restaurantId);
  const isPremiumPlus = currentSubscription?.plan?.code === 'premium_plus';

  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen || !currentRest) return null;

  // Plan Gating Check
  if (!isPremiumPlus) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
        <div className="relative bg-slate-950 border border-amber-500/30 rounded-3xl max-w-lg w-full p-8 text-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
            <Crown className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Premium Plus Luxury Feature
          </span>

          <h2 className="text-2xl font-extrabold mt-3">Excel & CSV Bulk Menu Import/Export</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Quickly onboard hundreds of dishes in seconds using Microsoft Excel, Google Sheets, or CSV tables. Automatic category creation and image link mapping.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Bulk upload hundreds of dishes in one spreadsheet</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Export current live menu to Excel / CSV backup anytime</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Auto-detects spice levels, dietary tags & categories</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Maybe Later
            </button>
            <button
              onClick={() => {
                onClose();
                openUpgradeModal('premium_plus');
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium Plus</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. Download Sample CSV Template
  const handleDownloadSampleCsv = () => {
    const headers = [
      'Category',
      'Dish Name',
      'Price',
      'Discount Price',
      'Dietary Type (veg/non_veg/egg/vegan/jain)',
      'Spice Level (0-3)',
      'Prep Time',
      'Description',
      'Image URL'
    ];

    const sampleRows = [
      [
        'Starters',
        'Paneer Tikka Angara',
        '360',
        '320',
        'veg',
        '2',
        '15 mins',
        'Chargrilled cottage cheese with yellow chili and saffron',
        'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'Starters',
        'Murg Malai Tikka',
        '420',
        '',
        'non_veg',
        '1',
        '18 mins',
        'Succulent chicken tenders steeped in clotted cream and cardamom',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'Main Course',
        'Dum Murgh Biryani',
        '495',
        '450',
        'non_veg',
        '2',
        '20 mins',
        'Layered basmati rice with aromatic Awadhi saffron',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'Desserts',
        'Kesar Pista Kulfi',
        '180',
        '',
        'veg',
        '0',
        '5 mins',
        'Traditional slow churned Indian saffron pistachio ice cream',
        'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=600&q=80'
      ]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...sampleRows.map(row => row.map(v => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'smartqr_menu_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export Current Live Menu to CSV
  const handleExportLiveMenu = () => {
    const cats = getRestaurantCategories(restaurantId);
    const items = getRestaurantItems(restaurantId);

    const headers = [
      'Category',
      'Dish Name',
      'Price',
      'Discount Price',
      'Dietary Type',
      'Spice Level',
      'Prep Time',
      'Description',
      'Image URL',
      'In Stock'
    ];

    const rows = items.map(item => {
      const cat = cats.find(c => c.id === item.category_id);
      return [
        cat?.name || 'Uncategorized',
        item.name,
        String(item.price),
        item.discount_price ? String(item.discount_price) : '',
        item.dietary_type,
        String(item.spice_level),
        item.preparation_time || '',
        item.description || '',
        item.image_url || '',
        item.is_available ? 'Yes' : 'No'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(row => row.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentRest.slug}_full_menu_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Handle File Upload & Parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setParseError('Please select a valid .csv spreadsheet file.');
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setParseError('The uploaded file contains no data rows.');
          return;
        }

        // Simple CSV Parser handling quotes
        const parseLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result.map(s => s.replace(/^"|"$/g, '').replace(/""/g, '"'));
        };

        const rows: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseLine(lines[i]);
          if (cols.length >= 2 && cols[1]) {
            rows.push({
              category: cols[0] || 'General',
              name: cols[1],
              price: parseFloat(cols[2]) || 200,
              discount_price: cols[3] ? parseFloat(cols[3]) : undefined,
              dietary_type: ['veg', 'non_veg', 'egg', 'vegan', 'jain'].includes((cols[4] || '').toLowerCase())
                ? (cols[4].toLowerCase() as DietaryType)
                : 'veg',
              spice_level: Math.min(3, Math.max(0, parseInt(cols[5]) || 0)),
              preparation_time: cols[6] || '15 mins',
              description: cols[7] || '',
              image_url: cols[8] || ''
            });
          }
        }

        if (rows.length === 0) {
          setParseError('Could not find valid dish rows in the CSV. Please check formatting.');
        } else {
          setParsedRows(rows);
        }
      } catch (err: any) {
        setParseError(`Error parsing CSV: ${err.message || 'Malformed file'}`);
      }
    };
    reader.readAsText(file);
  };

  // 4. Commit Bulk Import
  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);

    try {
      const existingCats = getRestaurantCategories(restaurantId);
      const catMap = new Map<string, string>();
      existingCats.forEach(c => catMap.set(c.name.toLowerCase().trim(), c.id));

      // Auto-create missing categories
      for (const row of parsedRows) {
        const catName = row.category.trim();
        const lower = catName.toLowerCase();
        if (!catMap.has(lower)) {
          const createdCat = addRestaurantCategory(restaurantId, catName, `Special selections of ${catName}`);
          catMap.set(lower, createdCat.id);
        }
      }

      // Add each dish
      let addedCount = 0;
      for (const row of parsedRows) {
        const catId = catMap.get(row.category.toLowerCase().trim()) || existingCats[0]?.id || 'cat-gen';
        addRestaurantItem(restaurantId, {
          category_id: catId,
          name: row.name,
          price: row.price,
          discount_price: row.discount_price,
          dietary_type: row.dietary_type,
          spice_level: row.spice_level,
          preparation_time: row.preparation_time,
          description: row.description,
          image_url: row.image_url,
          is_available: true,
          is_featured: false
        });
        addedCount++;
      }

      setImportSuccess(`Successfully imported ${addedCount} dishes across ${catMap.size} categories!`);
      setParsedRows([]);
      setCsvFile(null);
    } catch (err: any) {
      setParseError(`Failed to import dishes: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Bulk Menu Spreadsheet Manager</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium Plus
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Import or export hundreds of dishes instantly via Excel / CSV.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-900/60 p-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'import' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Dishes from Spreadsheet</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'export' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Live Menu to CSV</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 no-scrollbar">
          {importSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {parseError && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {activeTab === 'import' ? (
            <div className="space-y-6">
              {/* Step 1: Download Sample Template */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1. Download Sample CSV Template</h4>
                    <p className="text-[11px] text-slate-400">Pre-formatted columns with example dishes for Excel & Google Sheets.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download .csv</span>
                </button>
              </div>

              {/* Step 2: Upload CSV File */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">2. Select Your Completed Spreadsheet</label>
                <div className="p-6 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-3xl bg-slate-900/40 text-center transition flex flex-col items-center justify-center cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs font-bold text-white">
                    {csvFile ? csvFile.name : 'Click to browse or drop your .csv file here'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'Supports standard UTF-8 encoded comma separated files'}
                  </p>
                </div>
              </div>

              {/* Step 3: Parsed Preview */}
              {parsedRows.length > 0 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Ready to import {parsedRows.length} dishes
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Categories will be auto-created
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/90 divide-y divide-slate-800/80 text-xs">
                    {parsedRows.slice(0, 10).map((row, idx) => (
                      <div key={idx} className="p-2.5 px-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{row.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({row.category})</span>
                        </div>
                        <span className="font-bold text-amber-400">₹{row.price}</span>
                      </div>
                    ))}
                    {parsedRows.length > 10 && (
                      <div className="p-2 text-center text-[10px] text-slate-500 font-mono">
                        ...and {parsedRows.length - 10} more dishes
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCommitImport}
                    disabled={isImporting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {isImporting ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>Confirm & Add {parsedRows.length} Dishes to Menu</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Table className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Export Full Menu Backup</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Download all dishes, prices, descriptions, and dietary classifications in a single clean spreadsheet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportLiveMenu}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Menu CSV Export</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};