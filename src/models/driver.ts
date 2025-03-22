
export interface Driver {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY';
  rating: number;
  licensePlate: string;
  vehicleType: string;
  phoneNumber: string;
  imageUrl: string;
}
