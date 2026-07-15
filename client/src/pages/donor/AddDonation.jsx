import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlinePhoto, HiOutlineArrowLeft } from 'react-icons/hi2';
import { addDonation } from '../../services/donationService';
import { donationSchema } from '../../types/schemas';
import { ROUTES, CATEGORY_FORM_OPTIONS, UNIT_OPTIONS_BY_CATEGORY } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';

const AddDonation = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(donationSchema) });

  // When category changes, reset unit to first option for that category
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    const units = UNIT_OPTIONS_BY_CATEGORY[cat] || UNIT_OPTIONS_BY_CATEGORY['Other'];
    setValue('quantityUnit', units[0].value);
  };

  const currentUnits = selectedCategory
    ? (UNIT_OPTIONS_BY_CATEGORY[selectedCategory] || UNIT_OPTIONS_BY_CATEGORY['Other'])
    : [];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setImageError('Only JPG, JPEG, and PNG images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size must be less than 2 MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      setImageError('Please upload an image of the food.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));
      formData.append('image', imageFile);
      await addDonation(formData);
      toast.success('Donation added successfully! 🎉');
      reset();
      setImageFile(null);
      setImagePreview(null);
      setSelectedCategory('');
      navigate(ROUTES.DONOR_MY_DONATIONS);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
          border: '1px solid #fed7aa',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px',
              borderRadius: '12px',
              color: '#7c2d12',
              background: 'rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'; }}
          >
            <HiOutlineArrowLeft size={20} />
          </button>
          <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(234,88,12,0.3)',
            fontSize: '22px',
            flexShrink: 0,
            lineHeight: '48px',
            textAlign: 'center',
          }}>✍️</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#7c2d12', marginBottom: '2px' }}>
              Add Donation
            </h1>
            <p style={{ fontSize: '13px', color: '#c2410c', fontWeight: 500 }}>
              Share your surplus food with those in need.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300 block mb-2">
              Food Photo <span className="text-red-500">*</span>
            </label>
            <label
              htmlFor="donation-image"
              className="block w-full cursor-pointer"
            >
              <div
                className={`
                  max-w-md mx-auto w-full h-52 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 overflow-hidden
                  ${imageError ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10'}
                `}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <HiOutlinePhoto size={36} className="text-surface-300 dark:text-surface-600" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-surface-400 dark:text-surface-500">
                      JPG, JPEG, PNG — max 2 MB
                    </p>
                  </>
                )}
              </div>
            </label>
            <input
              id="donation-image"
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              className="hidden"
              onChange={handleImageChange}
            />
            {imageError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠</span> {imageError}
              </p>
            )}
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="text-xs text-red-500 mt-1 hover:underline cursor-pointer"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Food Name"
              placeholder="e.g. Biryani, Dal Rice"
              error={errors.foodName?.message}
              required
              {...register('foodName')}
            />

            {/* Quantity + Unit — stacked layout */}
            <div>
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300 block mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>

              {/* Number input */}
              <input
                type="number"
                min="1"
                placeholder="Enter quantity  e.g. 5, 20, 100"
                style={{
                  width: '100%',
                  border: '1.5px solid',
                  borderColor: errors.quantity ? '#ef4444' : '#e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  background: 'transparent',
                  outline: 'none',
                  color: 'inherit',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                className="dark:border-surface-700 focus:border-brand-500"
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mb-1 flex items-center gap-1">
                  <span>⚠</span> {errors.quantity.message}
                </p>
              )}

              {/* Unit dropdown */}
              <select
                style={{
                  width: '100%',
                  border: '1.5px solid',
                  borderColor: errors.quantityUnit ? '#ef4444' : '#e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: selectedCategory ? 'pointer' : 'not-allowed',
                  opacity: selectedCategory ? 1 : 0.5,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                className="dark:border-surface-700 focus:border-brand-500"
                disabled={!selectedCategory}
                {...register('quantityUnit')}
              >
                {!selectedCategory && (
                  <option value="">⬆ Select Food Category first to see units</option>
                )}
                {currentUnits.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              {errors.quantityUnit && !errors.quantity && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.quantityUnit.message}
                </p>
              )}
            </div>


            <Select
              label="Food Category"
              options={CATEGORY_FORM_OPTIONS}
              error={errors.category?.message}
              required
              placeholder="Select a category"
              {...register('category', {
                onChange: handleCategoryChange,
              })}
            />
            <Input
              label="Location / Address"
              placeholder="e.g. Andheri West, Mumbai"
              error={errors.location?.message}
              required
              {...register('location')}
            />
            <Input
              label="Expiry Time"
              placeholder="e.g. 3 hours, Tonight 9pm"
              error={errors.expiryTime?.message}
              required
              {...register('expiryTime')}
            />
          </div>

          <Textarea
            label="Description"
            rows={4}
            placeholder="Describe the food — type, quantity details, allergens, packaging..."
            error={errors.description?.message}
            required
            helper="Max 500 characters"
            {...register('description')}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} fullWidth size="lg">
              Submit Donation
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.DONOR_MY_DONATIONS)}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddDonation;
