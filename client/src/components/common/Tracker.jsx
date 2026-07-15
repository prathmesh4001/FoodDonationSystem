import React from 'react';
import {
  HiOutlineGift,
  HiOutlineHandRaised,
  HiOutlineCheckBadge,
} from 'react-icons/hi2';
import { formatDate } from '../../utils/helpers';

/**
 * Tracker Component
 * Renders a visual progress stepper for donation status.
 * @param {string} status - "Available", "Claimed", "Delivered"
 * @param {string} donatedAt - ISO string of donation creation
 * @param {string} updatedAt - ISO string of last status update
 * @param {object} claimedBy - Populated NGO object { name, phone }
 */
const Tracker = ({ status, donatedAt, updatedAt, claimedBy }) => {
  // Steps configuration
  const steps = [
    {
      id: 'donated',
      title: 'Food Donated',
      subtitle: 'Surplus food posted',
      icon: HiOutlineGift,
      time: donatedAt ? formatDate(donatedAt) : null,
      isActive: true, // Always completed first
      isCompleted: status === 'Claimed' || status === 'Delivered',
    },
    {
      id: 'claimed',
      title: 'Claimed by NGO',
      subtitle: claimedBy?.name ? `NGO: ${claimedBy.name}` : 'Waiting for claim...',
      phone: claimedBy?.phone || null,
      icon: HiOutlineHandRaised,
      time: status === 'Claimed' || status === 'Delivered' ? formatDate(updatedAt) : null,
      isActive: status === 'Claimed' || status === 'Delivered',
      isCompleted: status === 'Delivered',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      subtitle: status === 'Delivered' ? 'Distributed successfully!' : 'Delivery pending',
      icon: HiOutlineCheckBadge,
      time: status === 'Delivered' ? formatDate(updatedAt) : null,
      isActive: status === 'Delivered',
      isCompleted: status === 'Delivered',
    },
  ];

  return (
    <div className="w-full py-4 px-2">
      {/* Visual Line and Stepper */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 relative">
        
        {/* Connection line for Desktop */}
        <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[3px] bg-surface-100 dark:bg-surface-800 -z-10">
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ 
              width: status === 'Delivered' ? '100%' : status === 'Claimed' ? '50%' : '0%' 
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = step.isCompleted;
          const isActive = step.isActive;
          
          return (
            <div key={step.id} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 flex-1 w-full relative">
              {/* Connection line for Mobile */}
              {idx < steps.length - 1 && (
                <div className="md:hidden absolute left-[22px] top-[44px] bottom-[-24px] w-[3px] bg-surface-100 dark:bg-surface-800">
                  <div 
                    className="w-full bg-brand-500 transition-all duration-500 ease-out"
                    style={{ 
                      height: (idx === 0 && status !== 'Available') || (idx === 1 && status === 'Delivered') ? '100%' : '0%' 
                    }}
                  />
                </div>
              )}

              {/* Step Circle with Icon */}
              <div 
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                  ${isDone 
                    ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20' 
                    : isActive 
                      ? 'bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-900/10' 
                      : 'bg-white border-surface-200 text-surface-400 dark:bg-surface-900 dark:border-surface-800'
                  }
                `}
              >
                <Icon size={20} className={isActive && !isDone ? 'animate-pulse' : ''} />
              </div>

              {/* Step Content */}
              <div className="flex-1 md:flex-none flex flex-col md:items-center text-left md:text-center min-w-0">
                <span className={`text-sm font-semibold ${isActive ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-600'}`}>
                  {step.title}
                </span>
                
                <span className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 truncate max-w-xs block">
                  {step.subtitle}
                </span>

                {step.phone && (
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5 block">
                    📞 {step.phone}
                  </span>
                )}

                {step.time && (
                  <span className="text-[10px] text-surface-400 dark:text-surface-500 font-mono mt-1 bg-surface-50 dark:bg-surface-800 px-1.5 py-0.5 rounded">
                    {step.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracker;
