package com.workshop.openapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse d'erreur standardisée")
public class ErrorResponse {

    @Schema(description = "Code d'erreur HTTP", example = "404")
    private Integer status;

    @Schema(description = "Message d'erreur", example = "Produit non trouvé")
    private String message;

    @Schema(description = "Chemin de la requête", example = "/api/products/999")
    private String path;

    @Schema(description = "Timestamp de l'erreur", example = "2026-01-08T10:30:00")
    private LocalDateTime timestamp;

    public ErrorResponse(Integer status, String message, String path) {
        this.status = status;
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
