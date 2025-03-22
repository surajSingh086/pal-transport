
import React from "react";
import { 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Address } from "@/models/client";
import { Card, CardContent } from "@/components/ui/card";

interface AddressSelectionProps {
  addresses: Address[];
  useExisting: boolean;
  setUseExisting: (value: boolean) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  addressType: "source" | "destination";
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  addresses,
  useExisting,
  setUseExisting,
  selectedAddressId,
  setSelectedAddressId,
  addressType,
}) => {
  // Find the selected address object based on selectedAddressId
  const selectedAddress = selectedAddressId ? 
    addresses.find(addr => addr.id === selectedAddressId) : 
    null;

  // Debug logging
  React.useEffect(() => {
    console.log(`${addressType} selection:`, {
      useExisting,
      selectedAddressId,
      selectedAddress,
      availableAddresses: addresses
    });
  }, [useExisting, selectedAddressId, selectedAddress, addresses, addressType]);

  return (
    <div className="mb-4">
      <FormLabel>Use existing address?</FormLabel>
      <RadioGroup
        value={useExisting ? "existing" : "new"}
        onValueChange={(value) => setUseExisting(value === "existing")}
        className="flex space-x-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <Radio value="existing" id={`${addressType}-existing`} />
          <label htmlFor={`${addressType}-existing`}>Use client address</label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio value="new" id={`${addressType}-new`} />
          <label htmlFor={`${addressType}-new`}>Add new address</label>
        </div>
      </RadioGroup>

      {useExisting && (
        <div className="space-y-4 mt-4">
          <FormItem>
            <FormLabel>Select address</FormLabel>
            <Select 
              onValueChange={setSelectedAddressId}
              value={selectedAddressId || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id || ""}>
                    {address.addressLine1}, {address.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          {/* Display selected address details as read-only fields */}
          {selectedAddress && (
            <div className="mt-4 space-y-4 border p-4 rounded-md bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Selected Address Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Address Line 1</FormLabel>
                  <Input 
                    value={selectedAddress.addressLine1 || ""} 
                    readOnly 
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                {selectedAddress.addressLine2 && (
                  <div className="space-y-2">
                    <FormLabel>Address Line 2</FormLabel>
                    <Input 
                      value={selectedAddress.addressLine2 || ""} 
                      readOnly 
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <FormLabel>City</FormLabel>
                  <Input 
                    value={selectedAddress.city || ""} 
                    readOnly 
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>State</FormLabel>
                  <Input 
                    value={selectedAddress.state || ""} 
                    readOnly 
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>PIN Code</FormLabel>
                  <Input 
                    value={selectedAddress.pinCode || ""} 
                    readOnly 
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>Country</FormLabel>
                  <Input 
                    value={selectedAddress.country || ""} 
                    readOnly 
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSelection;
