import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, ImagePlus, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../utils/api';

const EditImagesModal = ({ auction, open, onClose, user, onUpdate }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && auction) {
      setImages(auction.images?.length > 0 ? [...auction.images] : (auction.image ? [auction.image] : []));
      setError('');
      setSuccess(false);
    }
  }, [open, auction]);

  if (!open) return null;

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    setError('');
    
    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const base64Images = await Promise.all(base64Promises);
      setImages([...images, ...base64Images]);
    } catch (err) {
      setError('Failed to process images');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setError('');
  };

  const handleSave = async () => {
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedAuction = await apiRequest(`/api/auctions/${auction._id}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ images }),
      });

      setSuccess(true);
      onUpdate(updatedAuction.images);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-soft-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-bg-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <ImagePlus className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Edit Auction Images</h2>
                <p className="text-xs text-text-secondary">Update the images for "{auction.title}"</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm"
              >
                <CheckCircle className="w-5 h-5" /> Images updated successfully!
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group shadow-sm">
                  <img src={src} alt={`Auction preview ${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-accent text-white text-[10px] font-bold uppercase tracking-wider text-center py-1">
                      Cover
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent/40 flex flex-col items-center justify-center cursor-pointer transition-colors bg-bg-primary">
                  <Upload className="w-6 h-6 text-text-secondary mb-2" />
                  <span className="text-xs font-semibold text-text-secondary">Upload</span>
                  <span className="text-[10px] text-text-secondary/70 mt-1">{5 - images.length} remaining</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">
                {images.length}/5 images used
              </span>
              
              <button
                onClick={handleSave}
                disabled={loading || success || images.length === 0}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl text-sm font-bold shadow-soft transition-all disabled:opacity-60 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>Save Changes <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditImagesModal;
