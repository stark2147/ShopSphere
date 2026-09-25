package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.AddressRequest;
import com.shopsphere.backend.dto.AddressResponse;
import com.shopsphere.backend.entity.Address;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.AddressRepository;
import com.shopsphere.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository
    ) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // Get currently logged-in user
    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // Add new address
    @Transactional
    public AddressResponse addAddress(AddressRequest request) {

        User user = getAuthenticatedUser();

        Address address = new Address();

        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setCountry(request.getCountry());
        address.setAddressType(request.getAddressType());

        // If this is the first address,
        // automatically make it default.
        List<Address> existingAddresses =
                addressRepository.findByUserId(user.getId());

        boolean shouldBeDefault =
                existingAddresses.isEmpty() || request.isDefaultAddress();

        if (shouldBeDefault) {
            removeDefaultAddress(user.getId());
        }

        address.setDefaultAddress(shouldBeDefault);

        Address savedAddress = addressRepository.save(address);

        return convertToResponse(savedAddress);
    }

    // Get all addresses of logged-in user
    public List<AddressResponse> getMyAddresses() {

        User user = getAuthenticatedUser();

        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get one address
    public AddressResponse getAddressById(Long addressId) {

        User user = getAuthenticatedUser();

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with id: " + addressId
                        ));

        return convertToResponse(address);
    }

    // Update address
    @Transactional
    public AddressResponse updateAddress(
            Long addressId,
            AddressRequest request
    ) {

        User user = getAuthenticatedUser();

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with id: " + addressId
                        ));

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setCountry(request.getCountry());
        address.setAddressType(request.getAddressType());

        if (request.isDefaultAddress()) {

            removeDefaultAddress(user.getId());

            address.setDefaultAddress(true);

        } else {

            // If the current address is already default,
            // don't remove its default status accidentally.
            address.setDefaultAddress(address.isDefaultAddress());
        }

        Address updatedAddress = addressRepository.save(address);

        return convertToResponse(updatedAddress);
    }

    // Delete address
    @Transactional
    public void deleteAddress(Long addressId) {

        User user = getAuthenticatedUser();

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with id: " + addressId
                        ));

        boolean wasDefault = address.isDefaultAddress();

        addressRepository.delete(address);

        // If the deleted address was default,
        // automatically make another address default.
        if (wasDefault) {

            List<Address> remainingAddresses =
                    addressRepository.findByUserId(user.getId());

            if (!remainingAddresses.isEmpty()) {

                Address newDefault = remainingAddresses.get(0);

                newDefault.setDefaultAddress(true);

                addressRepository.save(newDefault);
            }
        }
    }

    // Set address as default
    @Transactional
    public AddressResponse setDefaultAddress(Long addressId) {

        User user = getAuthenticatedUser();

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with id: " + addressId
                        ));

        removeDefaultAddress(user.getId());

        address.setDefaultAddress(true);

        Address savedAddress = addressRepository.save(address);

        return convertToResponse(savedAddress);
    }

    // Remove default flag from all user's addresses
    private void removeDefaultAddress(Long userId) {

        List<Address> addresses =
                addressRepository.findByUserId(userId);

        for (Address address : addresses) {

            if (address.isDefaultAddress()) {

                address.setDefaultAddress(false);

                addressRepository.save(address);
            }
        }
    }

    // Convert Entity → Response DTO
    private AddressResponse convertToResponse(Address address) {

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhoneNumber(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getLandmark(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.getCountry(),
                address.getAddressType(),
                address.isDefaultAddress()
        );
    }
}