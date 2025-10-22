import React, { useState, useRef } from 'react';
import type { LostItem } from '../types';

// MOCK DATA
const initialItems: LostItem[] = [
    { id: 1, name: 'Airpods Pro Case', description: 'Found near the library entrance. It has a blue silicone cover.', imageUrl: 'https://picsum.photos/seed/lost1/400/300', status: 'Found', date: 'Oct 28, 2024', location: 'Central Library' },
    { id: 2, name: 'Student ID Card', description: 'Lost my ID card, name is Rohan Sharma. Please contact if found.', imageUrl: 'https://picsum.photos/seed/lost2/400/300', status: 'Lost', date: 'Oct 27, 2024', location: 'Tech Park' },
    { id: 3, name: 'Black Umbrella', description: 'Left a black umbrella in the UFC food court.', imageUrl: 'https://picsum.photos/seed/lost3/400/300', status: 'Lost', date: 'Oct 26, 2024', location: 'UFC Food Court' },
    { id: 4, name: 'Physics Notebook', description: 'Found a notebook in SJT 505. Has some complex diagrams.', imageUrl: 'https://picsum.photos/seed/lost4/400/300', status: 'Found', date: 'Oct 25, 2024', location: 'SJT Building' },
    { id: 5, name: 'Silver Water Bottle', description: 'A silver Hydro Flask was left at the gym. It is now at the front desk.', imageUrl: 'https://picsum.photos/seed/lost5/400/300', status: 'Found', date: 'Oct 24, 2024', location: 'Fitness Center' },
];

// ICONS
const ReportIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const LostTagIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-5a1 1 0 10-2 0v2a1 1 0 102 0v-2zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const FoundTagIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ImageIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// --- Report Item Modal ---
interface ReportItemModalProps {
    onClose: () => void;
    onAddItem: (item: LostItem) => void;
}

const ReportItemModal: React.FC<ReportItemModalProps> = ({ onClose, onAddItem }) => {
    const [status, setStatus] = useState<'Lost' | 'Found'>('Lost');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: LostItem = {
            id: Date.now(),
            name,
            description,
            location,
            status,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            imageUrl: imagePreview || `https://picsum.photos/seed/${Date.now()}/400/300`,
            // In a real app, 'Claimed' status would be handled differently
        };
        onAddItem(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()} style={{ animationFillMode: 'forwards' }}>
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600" aria-label="Close form">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">Report an Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setStatus('Lost')} className={`py-3 rounded-lg font-semibold flex items-center justify-center transition-colors border-2 ${status === 'Lost' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}>
                                <LostTagIcon /> I Lost Something
                            </button>
                            <button type="button" onClick={() => setStatus('Found')} className={`py-3 rounded-lg font-semibold flex items-center justify-center transition-colors border-2 ${status === 'Found' ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}>
                                <FoundTagIcon /> I Found Something
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="itemName" className="text-sm font-medium text-rose-800">Item Name</label>
                        <input id="itemName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Black Jansport Backpack" required className="w-full mt-1 p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    </div>
                    <div>
                        <label htmlFor="description" className="text-sm font-medium text-rose-800">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Add any details that might help..." required className="w-full mt-1 p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400"></textarea>
                    </div>
                     <div>
                        <label htmlFor="location" className="text-sm font-medium text-rose-800">{status === 'Lost' ? 'Last Seen At' : 'Found At'}</label>
                        <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Tech Park, 3rd Floor" required className="w-full mt-1 p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-rose-800">Upload Image (Optional)</label>
                        <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-lime-300 border-dashed rounded-md cursor-pointer hover:border-rose-400 bg-lime-50">
                            {imagePreview ? <img src={imagePreview} alt="Preview" className="h-24 object-contain rounded" /> : (
                                <div className="space-y-1 text-center">
                                    <ImageIcon />
                                    <p className="text-sm text-rose-600">Click to upload an image</p>
                                </div>
                            )}
                        </div>
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-500 transition-colors">Submit Report</button>
                </form>
                <style>{`@keyframes fade-in-scale { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
            </div>
        </div>
    );
};


// --- SUB-COMPONENTS ---
const LostItemCard: React.FC<{ item: LostItem }> = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
        <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <div>
                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'}`}>
                    {item.status}
                </span>
                <h3 className="text-lg font-bold text-rose-900 mt-2">{item.name}</h3>
                <p className="text-sm text-rose-600 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="mt-auto pt-3 text-xs text-rose-500">
                <p><strong>{item.status === 'Lost' ? 'Last Seen:' : 'Found at:'}</strong> {item.location}</p>
                <p><strong>Date:</strong> {item.date}</p>
            </div>
        </div>
        <div className="p-2 border-t border-lime-100 text-center">
            <button className="w-full text-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors py-1">
                {item.status === 'Found' ? 'Claim This Item' : 'I Have Found This!'}
            </button>
        </div>
    </div>
);


// MAIN COMPONENT
const LostAndFound: React.FC = () => {
    const [items, setItems] = useState<LostItem[]>(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState<'idle' | 'lost' | 'found'>('idle');

    const lostItems = items.filter(item => item.status === 'Lost');
    const foundItems = items.filter(item => item.status === 'Found');
    
    const handleAddItem = (item: LostItem) => {
        setItems(prevItems => [item, ...prevItems]);
    };

    const renderListView = (title: string, itemsToList: LostItem[], emptyMessage: string) => (
         <div className="w-full">
            <div className="flex justify-between items-center mb-6 px-2">
                 <h2 className="text-3xl font-bold text-rose-900">{title}</h2>
                 <button onClick={() => setView('idle')} className="text-rose-500 font-semibold hover:underline">
                    &larr; Back
                 </button>
            </div>
            {itemsToList.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsToList.map(item => <LostItemCard key={item.id} item={item} />)}
                 </div>
            ) : (
                <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-rose-900">No Items Here</h3>
                    <p className="text-rose-600 mt-2">{emptyMessage}</p>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'lost':
                return renderListView('Lost Items', lostItems, 'No lost items have been reported yet.');
            case 'found':
                return renderListView('Found Items', foundItems, 'No found items have been reported yet.');
            case 'idle':
            default:
                return (
                    <div className="text-center">
                         <p className="text-lg text-rose-600 max-w-2xl mx-auto">Help fellow students by reporting items you've lost or found around campus.</p>
                         <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => setView('lost')}
                                className="px-8 py-4 bg-rose-400 text-white font-semibold rounded-full shadow-lg hover:bg-rose-500 transition-colors transform hover:scale-105 duration-300">
                                Browse Lost Items ({lostItems.length})
                            </button>
                            <button 
                                onClick={() => setView('found')}
                                className="px-8 py-4 bg-red-300 text-white font-semibold rounded-full shadow-lg hover:bg-red-400 transition-colors transform hover:scale-105 duration-300">
                                Browse Found Items ({foundItems.length})
                            </button>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 text-rose-500 font-semibold hover:underline">
                             Or, Report a New Item
                        </button>
                    </div>
                );
        }
    };

    return (
        <section className="py-20 bg-lime-100">
            <div className="container mx-auto px-4">
                 {view === 'idle' && (
                    <div className="text-center mb-12">
                         <div className="flex justify-center items-center mb-4">
                            <svg className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7H3" />
                            </svg>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Lost & Found</h2>
                        </div>
                    </div>
                )}

                {renderContent()}
            </div>
            
            {isModalOpen && <ReportItemModal onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />}
        </section>
    );
};

export default LostAndFound;
