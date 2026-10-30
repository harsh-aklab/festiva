import { useState, useRef } from 'react';
import {
  Upload, ImageIcon, Heart, Plus, Minus, Check, X, Sparkles,
  Layers, Eye, Save, Filter, Package, ChevronLeft, Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { decorationItems, decorationPackages } from '@/data/catalogue';
import { formatPrice } from '@/utils/format';
import { eventTypesList } from '@/data/catalogue';
import type { EventType } from '@/types';

export function DesignStudioPage() {
  const { navigate, venuePhoto, setVenuePhoto, savedDecorationIds, toggleSavedDecoration,
    selectedDecorationIds, toggleSelectedDecoration, decorationQuantities, setDecorationQuantity } = useApp();
  const [activeTab, setActiveTab] = useState<'catalogue' | 'packages' | 'studio'>('catalogue');
  const [filterStyle, setFilterStyle] = useState('');
  const [filterEventType, setFilterEventType] = useState<EventType | ''>('');
  const [filterAvailability, setFilterAvailability] = useState(false);
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [...new Set(decorationItems.map((i) => i.style))];

  const filteredItems = decorationItems.filter((item) => {
    if (filterStyle && item.style !== filterStyle) return false;
    if (filterEventType && !item.eventTypes.includes(filterEventType as EventType)) return false;
    if (filterAvailability && !item.available) return false;
    return true;
  });

  const selectedItemDetails = selectedDecorationIds
    .map((id) => decorationItems.find((i) => i.id === id))
    .filter(Boolean);

  const selectedTotal = selectedItemDetails.reduce((sum, item) => {
    if (!item) return sum;
    return sum + item.price * (decorationQuantities[item.id] || 1);
  }, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVenuePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePreview = () => {
    setPreviewGenerating(true);
    setTimeout(() => setPreviewGenerating(false), 2000);
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Design Studio
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
            Design Your Event Space
          </h1>
          <p className="text-forest-400 mt-2">
            Browse decorations, build your custom design, upload your venue photo, and preview the concept.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {[
            { id: 'catalogue' as const, label: 'Decoration Catalogue', icon: Filter },
            { id: 'packages' as const, label: 'Complete Packages', icon: Package },
            { id: 'studio' as const, label: 'Venue Design Preview', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-forest-600 text-cream-50 shadow-forest'
                    : 'bg-white text-forest-500 border border-cream-200 hover:border-cream-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Catalogue Tab */}
        {activeTab === 'catalogue' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5 sticky top-24">
                <h3 className="font-serif text-lg font-bold text-forest-800 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-500 uppercase tracking-wide mb-2">Style</label>
                    <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)} className="input-festiva text-sm py-2">
                      <option value="">All styles</option>
                      {styles.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-500 uppercase tracking-wide mb-2">Event Type</label>
                    <select value={filterEventType} onChange={(e) => setFilterEventType(e.target.value as EventType | '')} className="input-festiva text-sm py-2">
                      <option value="">All event types</option>
                      {eventTypesList.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => setFilterAvailability(!filterAvailability)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${filterAvailability ? 'bg-forest-500' : 'bg-cream-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${filterAvailability ? 'translate-x-5' : ''}`} />
                      </button>
                      <span className="text-sm text-forest-600">Available only</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Items grid */}
            <div className="lg:col-span-3">
              <p className="text-sm text-forest-400 mb-4">
                <span className="font-semibold text-forest-700">{filteredItems.length}</span> decoration items
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const isSelected = selectedDecorationIds.includes(item.id);
                  const isSaved = savedDecorationIds.includes(item.id);
                  return (
                    <div key={item.id} className="card-festiva overflow-hidden">
                      <div className="relative h-44 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        {!item.available && (
                          <div className="absolute inset-0 bg-forest-900/50 flex items-center justify-center">
                            <span className="badge-festiva bg-red-100 text-red-700">Out of Stock</span>
                          </div>
                        )}
                        <button
                          onClick={() => toggleSavedDecoration(item.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-gold-400 text-gold-400' : 'text-forest-500'}`} />
                        </button>
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-forest-600 text-cream-50 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-base font-bold text-forest-800">{item.name}</h3>
                        <p className="text-xs text-forest-400 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="badge-festiva bg-cream-100 text-forest-500">{item.style}</span>
                          <span className="badge-festiva bg-cream-100 text-forest-500">{item.color}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-100">
                          <div>
                            <p className="font-serif text-lg font-bold text-forest-700">{formatPrice(item.price)}</p>
                            <p className="text-xs text-forest-400">per {item.unit}</p>
                          </div>
                          <button
                            onClick={() => item.available && toggleSelectedDecoration(item.id)}
                            disabled={!item.available}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-forest-600 text-cream-50'
                                : item.available
                                ? 'bg-forest-50 text-forest-600 border border-forest-200 hover:bg-forest-100'
                                : 'bg-cream-100 text-cream-300 cursor-not-allowed'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {decorationPackages.map((pkg) => (
              <div key={pkg.id} className="card-festiva overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-cream-50">
                    <span className="badge-festiva bg-gold-400 text-forest-900 mb-2">{pkg.style}</span>
                    <h3 className="font-serif text-xl font-bold">{pkg.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-forest-400">{pkg.description}</p>
                  <div className="mt-3 space-y-1">
                    {pkg.itemIds.map((id) => {
                      const item = decorationItems.find((i) => i.id === id);
                      return item ? (
                        <div key={id} className="flex items-center gap-2 text-sm text-forest-500">
                          <Check className="w-3.5 h-3.5 text-forest-400" />
                          {item.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100">
                    <div>
                      <p className="text-xs text-forest-400">Package price</p>
                      <p className="font-serif text-2xl font-bold text-forest-700">{formatPrice(pkg.price)}</p>
                    </div>
                    <button
                      onClick={() => {
                        pkg.itemIds.forEach((id) => {
                          if (!selectedDecorationIds.includes(id)) toggleSelectedDecoration(id);
                        });
                        setActiveTab('studio');
                      }}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Use Package
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Studio Tab */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload + preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload area */}
              <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
                <h2 className="font-serif text-xl font-bold text-forest-800 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-forest-500" /> Upload Your Venue Photo
                </h2>
                {!venuePhoto ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cream-300 rounded-2xl p-12 text-center cursor-pointer hover:border-forest-400 hover:bg-forest-50/30 transition-all"
                  >
                    <ImageIcon className="w-12 h-12 text-cream-300 mx-auto mb-4" />
                    <p className="text-forest-500 font-medium">Click to upload your venue photo</p>
                    <p className="text-sm text-forest-400 mt-1">JPG, PNG up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={venuePhoto} alt="Your venue" className="w-full max-h-96 object-contain bg-cream-100" />
                    <button
                      onClick={() => setVenuePhoto(null)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-forest-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
                <h2 className="font-serif text-xl font-bold text-forest-800 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-forest-500" /> AI Venue Design Preview
                </h2>

                {!venuePhoto && selectedItemDetails.length === 0 && (
                  <div className="text-center py-12 text-forest-400">
                    <Layers className="w-12 h-12 text-cream-300 mx-auto mb-3" />
                    <p>Upload a venue photo and select decorations to generate a preview.</p>
                  </div>
                )}

                {venuePhoto && selectedItemDetails.length > 0 && (
                  <>
                    {previewGenerating ? (
                      <div className="relative rounded-xl overflow-hidden">
                        <img src={venuePhoto} alt="Generating preview" className="w-full max-h-96 object-contain bg-cream-100" />
                        <div className="absolute inset-0 bg-forest-900/40 flex flex-col items-center justify-center text-cream-50">
                          <Sparkles className="w-10 h-10 animate-pulse mb-3" />
                          <p className="font-serif text-lg">Generating design concept...</p>
                          <p className="text-sm text-cream-200 mt-1">Placing decorations in your venue space</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden">
                        <img src={venuePhoto} alt="Venue with decoration concept" className="w-full max-h-96 object-contain bg-cream-100" />
                        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-forest-900/70 backdrop-blur text-cream-50">
                          <p className="text-xs flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-gold-300" />
                            This is an AI-generated concept preview, not a guaranteed final installation.
                            Actual results may vary based on venue conditions and provider execution.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button onClick={handleGeneratePreview} disabled={previewGenerating} className="btn-primary text-sm">
                        <RefreshIcon /> Regenerate
                      </button>
                      <button className="btn-secondary text-sm">
                        <Save className="w-4 h-4" /> Save Preview
                      </button>
                    </div>
                  </>
                )}

                {venuePhoto && selectedItemDetails.length === 0 && (
                  <div className="text-center py-12 text-forest-400">
                    <p>Select decorations from the catalogue to see them in your venue preview.</p>
                    <button onClick={() => setActiveTab('catalogue')} className="btn-ghost mt-4">
                      Browse Catalogue
                    </button>
                  </div>
                )}

                {!venuePhoto && selectedItemDetails.length > 0 && (
                  <div className="text-center py-12 text-forest-400">
                    <p>You have {selectedItemDetails.length} items selected. Upload a venue photo to see the preview.</p>
                  </div>
                )}

                {/* Honest disclosure about AI image generation */}
                <div className="mt-4 p-4 rounded-xl bg-gold-50 border border-gold-200">
                  <p className="text-xs text-gold-700 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>AI image generation is not yet connected.</strong> When a real image-editing API is configured,
                      this feature will generate visual decoration concepts on your uploaded venue photo.
                      For now, this is a placeholder showing where the preview will appear.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Selected items sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5 sticky top-24">
                <h3 className="font-serif text-lg font-bold text-forest-800 mb-4">
                  Your Design ({selectedItemDetails.length} items)
                </h3>

                {selectedItemDetails.length === 0 ? (
                  <p className="text-sm text-forest-400 py-8 text-center">
                    No items selected yet. Browse the catalogue to build your design.
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedItemDetails.map((item) => item && (
                        <div key={item.id} className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-forest-700 truncate">{item.name}</p>
                            <p className="text-xs text-forest-400">{formatPrice(item.price)}/{item.unit}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDecorationQuantity(item.id, (decorationQuantities[item.id] || 1) - 1)}
                              className="w-6 h-6 rounded-full bg-cream-100 flex items-center justify-center text-forest-600 hover:bg-cream-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-forest-700">
                              {decorationQuantities[item.id] || 1}
                            </span>
                            <button
                              onClick={() => setDecorationQuantity(item.id, (decorationQuantities[item.id] || 1) + 1)}
                              className="w-6 h-6 rounded-full bg-cream-100 flex items-center justify-center text-forest-600 hover:bg-cream-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => toggleSelectedDecoration(item.id)}
                              className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-cream-100 mt-4 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-forest-500">Estimated Total</span>
                        <span className="font-serif text-xl font-bold text-forest-700">{formatPrice(selectedTotal)}</span>
                      </div>
                      <button onClick={() => navigate('budget')} className="btn-primary w-full text-sm py-2.5">
                        View in Budget Calculator
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
