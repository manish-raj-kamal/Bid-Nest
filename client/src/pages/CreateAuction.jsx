import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ImagePlus, DollarSign, Clock, Tag, FileText, ArrowRight, X, Upload, Lock } from 'lucide-react';
import { useAuth } from '../context/auth';
import { apiRequest } from '../utils/api';

const categories = ['Electronics', 'Vehicles', 'Real Estate', 'Art', 'Jewelry', 'Collectibles', 'Fashion'];

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    startingBid: '',
    duration: '24',
    images: [],
  });

  const [imagePreview, setImagePreview] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreview.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

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
      setImagePreview([...imagePreview, ...base64Images]);
      setForm({ ...form, images: [...form.images, ...base64Images] });
    } catch (err) {
      setError('Failed to process images');
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    const newImages = form.images.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
    setForm({ ...form, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!form.title || !form.description || !form.category || !form.startingBid) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + parseInt(form.duration) * 60 * 60 * 1000);

      await apiRequest('/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          startingBid: parseFloat(form.startingBid),
          startTime: now.toISOString(),
          endTime: endTime.toISOString(),
          images: imagePreview.length > 0 ? imagePreview : ['/placeholder-auction.png'],
          status: 'live',
        }),
      });

      setSuccess(true);
      setTimeout(() => navigate('/auctions'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Sign in required</h2>
          <p className="text-text-secondary mb-6">You need to be logged in to create an auction</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
            List an Item
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
            Create Auction
          </h1>
          <p className="text-text-secondary mt-2">List your premium item for bidding</p>
        </motion.div>

        {/* Success message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-2xl bg-accent-light border border-accent/20 text-center"
          >
            <h3 className="text-lg font-bold text-accent mb-1">Auction Created!</h3>
            <p className="text-sm text-accent/80">Redirecting to auctions page...</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl border border-border p-8 lg:p-10 shadow-soft-lg"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                <Tag className="w-3.5 h-3.5" /> Auction Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Swiss Chronograph Watch"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                <FileText className="w-3.5 h-3.5" /> Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your item in detail..."
                required
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300 resize-none"
              />
            </div>

            {/* Category & Starting Bid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  <Tag className="w-3.5 h-3.5" /> Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-sm text-text-primary focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300 cursor-pointer appearance-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  <DollarSign className="w-3.5 h-3.5" /> Starting Bid ($)
                </label>
                <input
                  type="number"
                  name="startingBid"
                  value={form.startingBid}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                <Clock className="w-3.5 h-3.5" /> Auction Duration
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '6 Hours', value: '6' },
                  { label: '12 Hours', value: '12' },
                  { label: '24 Hours', value: '24' },
                  { label: '3 Days', value: '72' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, duration: opt.value })}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all duration-300 cursor-pointer ${
                      form.duration === opt.value
                        ? 'bg-accent text-white border-accent shadow-soft'
                        : 'bg-bg-primary text-text-secondary border-border hover:border-accent/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                <ImagePlus className="w-3.5 h-3.5" /> Product Images
              </label>
              <div className="grid grid-cols-5 gap-3">
                {imagePreview.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {imagePreview.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent/40 flex flex-col items-center justify-center cursor-pointer transition-colors bg-bg-primary">
                    <Upload className="w-5 h-5 text-text-secondary mb-1" />
                    <span className="text-[10px] text-text-secondary">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-2">Upload up to 5 images. First image will be the cover.</p>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading || success}
              type="submit"
              className="w-full py-4 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark shadow-soft hover:shadow-soft-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Creating Auction...' : 'Create Auction'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAuction;
