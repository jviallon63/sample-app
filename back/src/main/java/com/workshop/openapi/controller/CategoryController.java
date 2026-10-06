package com.workshop.openapi.controller;

import com.workshop.openapi.dto.CategoryRequest;
import com.workshop.openapi.dto.CategoryResponse;
import com.workshop.openapi.dto.ErrorResponse;
import com.workshop.openapi.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "API de gestion des catégories de produits")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(
        summary = "Liste toutes les catégories",
        description = "Retourne la liste complète des catégories de produits. Accessible à tous les utilisateurs authentifiés.",
        operationId = "getAllCategories"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Liste récupérée avec succès",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = CategoryResponse.class)
        )
    )
    public Page<CategoryResponse> getAllCategories(@ParameterObject Pageable pageable) {
        return categoryService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Récupère une catégorie par ID",
        description = "Retourne les détails d'une catégorie spécifique. Accessible à tous les utilisateurs authentifiés.",
        operationId = "getCategoryById"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Catégorie trouvée",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CategoryResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Catégorie non trouvée",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    })
    public ResponseEntity<CategoryResponse> getCategory(
        @Parameter(description = "ID de la catégorie", required = true, example = "1")
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PostMapping
    @Operation(
        summary = "Créer une nouvelle catégorie",
        description = "Ajoute une nouvelle catégorie. Accessible uniquement aux rôles MANAGER et ADMIN.",
        operationId = "createCategory"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Catégorie créée avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CategoryResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Données invalides"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès refusé - Rôle MANAGER ou ADMIN requis"
        )
    })
    public ResponseEntity<CategoryResponse> createCategory(
        @Valid @RequestBody CategoryRequest request
    ) {
        CategoryResponse created = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Mettre à jour une catégorie",
        description = "Modifie les informations d'une catégorie existante. Accessible uniquement aux rôles MANAGER et ADMIN.",
        operationId = "updateCategory"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Catégorie mise à jour",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CategoryResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Catégorie non trouvée"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès refusé - Rôle MANAGER ou ADMIN requis"
        )
    })
    public ResponseEntity<CategoryResponse> updateCategory(
        @Parameter(description = "ID de la catégorie à modifier")
        @PathVariable Long id,
        @Valid @RequestBody CategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Supprimer une catégorie",
        description = "Retire une catégorie. Accessible uniquement au rôle ADMIN.",
        operationId = "deleteCategory"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "Catégorie supprimée"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Catégorie non trouvée"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès refusé - Rôle ADMIN requis"
        )
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(
        @Parameter(description = "ID de la catégorie à supprimer")
        @PathVariable Long id
    ) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
