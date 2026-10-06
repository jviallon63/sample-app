package com.workshop.openapi.controller;

import com.workshop.openapi.dto.ErrorResponse;
import com.workshop.openapi.dto.ProductRequest;
import com.workshop.openapi.dto.ProductResponse;
import com.workshop.openapi.service.ProductService;
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

import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "API de gestion des produits du catalogue")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(
        summary = "Liste tous les produits",
        description = "Retourne la liste complète des produits disponibles dans le catalogue. Accessible à tous les utilisateurs authentifiés.",
        operationId = "getAllProducts"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Liste récupérée avec succès",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ProductResponse.class)
        )
    )
    public Page<ProductResponse> getAllProducts(@ParameterObject Pageable pageable) {
        return productService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Récupère un produit par ID",
        description = "Retourne les détails complets d'un produit spécifique. Accessible à tous les utilisateurs authentifiés.",
        operationId = "getProductById"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Produit trouvé avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Produit non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès refusé - Authentification requise"
        )
    })
    public ResponseEntity<ProductResponse> getProduct(
        @Parameter(description = "ID du produit à récupérer", required = true, example = "1")
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping
    @Operation(
        summary = "Créer un nouveau produit",
        description = "Ajoute un nouveau produit au catalogue. Accessible uniquement aux rôles MANAGER et ADMIN.",
        operationId = "createProduct"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Produit créé avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Données invalides - vérifiez les champs requis"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès refusé - Rôle MANAGER ou ADMIN requis"
        )
    })
    public ResponseEntity<ProductResponse> createProduct(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Données du produit à créer",
            required = true,
            content = @Content(
                schema = @Schema(implementation = ProductRequest.class)
            )
        )
        @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Mettre à jour un produit",
        description = "Modifie les informations d'un produit existant. Accessible uniquement aux rôles MANAGER et ADMIN.",
        operationId = "updateProduct"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Produit mis à jour avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Produit non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
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
    public ResponseEntity<ProductResponse> updateProduct(
        @Parameter(description = "ID du produit à modifier", required = true, example = "1")
        @PathVariable Long id,
        @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Supprimer un produit",
        description = "Retire un produit du catalogue. Accessible uniquement au rôle ADMIN.",
        operationId = "deleteProduct"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "Produit supprimé avec succès"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Produit non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès refusé - Rôle ADMIN requis"
        )
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(
        @Parameter(description = "ID du produit à supprimer", required = true, example = "1")
        @PathVariable Long id
    ) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(
        summary = "Rechercher des produits",
        description = "Recherche des produits par nom ou description. Accessible à tous les utilisateurs authentifiés.",
        operationId = "searchProducts"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Résultats de la recherche",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ProductResponse.class)
        )
    )
    public List<ProductResponse> searchProducts(
        @Parameter(description = "Terme de recherche", required = true, example = "laptop")
        @RequestParam String query
    ) {
        return productService.search(query);
    }

    @GetMapping("/in-stock")
    @Operation(
        summary = "Produits en stock",
        description = "Retourne tous les produits ayant un stock supérieur à 0. Accessible à tous les utilisateurs authentifiés.",
        operationId = "getProductsInStock"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Liste des produits en stock",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ProductResponse.class)
        )
    )
    public List<ProductResponse> getProductsInStock() {
        return productService.findInStock();
    }
}
