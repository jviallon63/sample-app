package com.workshop.openapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'un produit")
public class ProductResponse {

    @Schema(description = "Identifiant unique du produit", example = "1")
    private Long id;

    @Schema(description = "Nom du produit", example = "Laptop Dell XPS 15")
    private String name;

    @Schema(description = "Description du produit", example = "Ordinateur portable haute performance")
    private String description;

    @Schema(description = "Prix en euros", example = "1299.99")
    private BigDecimal price;

    @Schema(description = "Quantité en stock", example = "15")
    private Integer stock;

    @Schema(description = "Date de création", example = "2026-01-08T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "Date de dernière modification", example = "2026-01-08T15:45:00")
    private LocalDateTime updatedAt;
}
