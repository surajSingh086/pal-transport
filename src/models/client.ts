
export enum AddressType {
  OFFICE = "OFFICE",
  BILLING = "BILLING",
  TRANSPORT = "TRANSPORT",
  DRIVER = "DRIVER"
}

export interface Address {
  id?: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  addressType: AddressType;
}

export interface Client {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPersonName: string;
  contactNumber: string;
  alternateContact?: string;
  gstNumber?: string;
  addresses: Address[];
}
