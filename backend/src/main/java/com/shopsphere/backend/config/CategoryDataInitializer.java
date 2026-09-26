package com.shopsphere.backend.config;

import com.shopsphere.backend.entity.Category;
import com.shopsphere.backend.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CategoryDataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public CategoryDataInitializer(
            CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {

        if (categoryRepository.count() > 0) {
            return;
        }

        createCategory(
                "Electronics",
                "Electronic devices, gadgets and accessories"
        );

        createCategory(
                "Clothing",
                "Men's, women's and children's clothing"
        );

        createCategory(
                "Home & Kitchen",
                "Home appliances, kitchen items and household products"
        );

        createCategory(
                "Books",
                "Books, novels and educational materials"
        );

        createCategory(
                "Sports",
                "Sports equipment, fitness products and accessories"
        );

        createCategory(
                "Beauty",
                "Beauty, personal care and grooming products"
        );

        createCategory(
                "Toys",
                "Toys, games and children's products"
        );

        createCategory(
                "Accessories",
                "Fashion and lifestyle accessories"
        );

        System.out.println(
                "===================================="
        );

        System.out.println(
                "ShopSphere default categories created successfully"
        );

        System.out.println(
                "===================================="
        );
    }

    private void createCategory(
            String name,
            String description) {

        Category category = new Category();

        category.setName(name);
        category.setDescription(description);

        categoryRepository.save(category);
    }
}