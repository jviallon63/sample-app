package com.workshop.openapi.service;

import com.workshop.openapi.dto.CategoryRequest;
import com.workshop.openapi.dto.CategoryResponse;
import com.workshop.openapi.exception.ResourceNotFoundException;
import com.workshop.openapi.model.Category;
import com.workshop.openapi.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée avec l'ID: " + id));
        return toResponse(category);
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = toEntity(request);
        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée avec l'ID: " + id));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        Category updated = categoryRepository.save(category);
        return toResponse(updated);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Catégorie non trouvée avec l'ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt()
        );
    }

    private Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return category;
    }
}
