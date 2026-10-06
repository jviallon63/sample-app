package com.workshop.openapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requête pour créer ou modifier un produit")
public class ProductRequest {

    @Schema(
        description = "Nom du produit",
        example = "Laptop Dell XPS 15",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 3,
        maxLength = 100
    )
    @NotBlank(message = "Le nom du produit est obligatoire")
    @Size(min = 3, max = 100, message = "Le nom doit contenir entre 3 et 100 caractères")
    private String name;

    @Schema(
        description = "Description détaillée du produit",
        example = "Ordinateur portable haute performance avec écran 4K",
        maxLength = 500
    )
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;

    @Schema(
        description = "Prix du produit en euros",
        example = "1299.99",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "0.01",
        maximum = "999999.99"
    )
    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    @DecimalMax(value = "999999.99", message = "Le prix ne peut pas dépasser 999999.99")
    @Digits(integer = 8, fraction = 2, message = "Le prix doit avoir au maximum 2 décimales")
    private BigDecimal price;

    @Schema(
        description = "Quantité en stock",
        example = "15",
        minimum = "0"
    )
    @Min(value = 0, message = "Le stock ne peut pas être négatif")
    private Integer stock = 0;
}
