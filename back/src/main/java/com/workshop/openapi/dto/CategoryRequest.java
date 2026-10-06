package com.workshop.openapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requête pour créer ou modifier une catégorie")
public class CategoryRequest {

    @Schema(
        description = "Nom de la catégorie",
        example = "Ordinateurs",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 3,
        maxLength = 50
    )
    @NotBlank(message = "Le nom de la catégorie est obligatoire")
    @Size(min = 3, max = 50, message = "Le nom doit contenir entre 3 et 50 caractères")
    private String name;

    @Schema(
        description = "Description de la catégorie",
        example = "Ordinateurs portables et de bureau",
        maxLength = 255
    )
    @Size(max = 255, message = "La description ne peut pas dépasser 255 caractères")
    private String description;
}
