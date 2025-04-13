
import React, { useState, useEffect } from 'react';
import { apiService, StoreInfo } from '@/services/api';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StoreInfoPage: React.FC = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const storeInfoData = await apiService.getStoreInfo();
        
        // Assuming we only have one store info entry
        if (storeInfoData && storeInfoData.length > 0) {
          setStoreInfo(storeInfoData[0]);
        } else {
          setError('No store information available.');
        }
      } catch (err) {
        setError('Failed to load store information. Please try again later.');
        console.error('Error fetching store info:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoreInfo();
  }, []);

  return (
    <div className="pizza-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-pizza-text">Store Information</h1>
        
        {isLoading ? (
          <div className="pizza-card p-8 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4 mb-8">
            {error}
          </div>
        ) : storeInfo ? (
          <div className="pizza-card p-8">
            <div className="mb-8">
              <div className="flex items-start mb-4">
                <MapPin className="text-pizza-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Our Location</h2>
                  <p className="text-gray-700 whitespace-pre-line">{storeInfo.address}</p>
                </div>
              </div>
              
              <div className="w-full h-64 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">Map View</span>
              </div>
              
              <div className="text-gray-700">
                <h3 className="font-medium mb-2">How to find us:</h3>
                <p className="whitespace-pre-line">{storeInfo.directions}</p>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex items-start mb-6">
                <Phone className="text-pizza-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                  <p className="text-gray-700">
                    Phone: <a href={`tel:${storeInfo.contact_phone}`} className="text-pizza-primary hover:underline">{storeInfo.contact_phone}</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-pizza-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>Monday - Thursday</div>
                    <div>11:00 AM - 10:00 PM</div>
                    <div>Friday - Saturday</div>
                    <div>11:00 AM - 11:00 PM</div>
                    <div>Sunday</div>
                    <div>12:00 PM - 9:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4">
            No store information available.
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreInfoPage;
