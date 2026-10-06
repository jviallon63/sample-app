package com.workshop.openapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'une catégorie")
public class CategoryResponse {

    @Schema(description = "Identifiant unique de la catégorie", example = "1")
    private Long id;

    @Schema(description = "Nom de la catégorie", example = "Ordinateurs")
    private String name;

    @Schema(description = "Description de la catégorie", example = "Ordinateurs portables et de bureau")
    private String description;

    @Schema(description = "Date de création", example = "2026-01-08T10:30:00")
    private LocalDateTime createdAt;
}
