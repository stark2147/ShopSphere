package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.AddressRequest;
import com.shopsphere.backend.dto.AddressResponse;
import com.shopsphere.backend.service.AddressService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Add address
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AddressResponse addAddress(
            @Valid @RequestBody AddressRequest request
    ) {
        return addressService.addAddress(request);
    }

    // Get all my addresses
    @GetMapping
    public List<AddressResponse> getMyAddresses() {
        return addressService.getMyAddresses();
    }

    // Get one address
    @GetMapping("/{addressId}")
    public AddressResponse getAddressById(
            @PathVariable Long addressId
    ) {
        return addressService.getAddressById(addressId);
    }

    // Update address
    @PutMapping("/{addressId}")
    public AddressResponse updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request
    ) {
        return addressService.updateAddress(addressId, request);
    }

    // Delete address
    @DeleteMapping("/{addressId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(
            @PathVariable Long addressId
    ) {
        addressService.deleteAddress(addressId);
    }

    // Set default address
    @PutMapping("/{addressId}/default")
    public AddressResponse setDefaultAddress(
            @PathVariable Long addressId
    ) {
        return addressService.setDefaultAddress(addressId);
    }
}