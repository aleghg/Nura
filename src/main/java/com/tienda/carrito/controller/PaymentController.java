package com.tienda.carrito.controller;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import com.tienda.carrito.model.CarritoDetalle;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @PostMapping("/create")
    public ResponseEntity<?> crear(@RequestBody List<CarritoDetalle> items) throws Exception {

        MercadoPagoConfig.setAccessToken("TU_ACCESS_TOKEN");

        List<PreferenceItemRequest> mpItems = new ArrayList<>();

        for (CarritoDetalle item : items) {
            mpItems.add(
                    PreferenceItemRequest.builder()
                            .id(item.getProducto().getIdProducto().toString())
                            .title(item.getProducto().getNombre())
                            .quantity(item.getCantidad())
                            .unitPrice(item.getPrecioUnitario()) // ✅ ya es BigDecimal
                            .currencyId("COP")
                            .build()
            );
        }

        PreferenceRequest request = PreferenceRequest.builder()
                .items(mpItems)
                .backUrls(
                        PreferenceBackUrlsRequest.builder()
                                .success("http://localhost:4200/pago-exitoso")
                                .pending("http://localhost:4200/pago-pendiente")
                                .failure("http://localhost:4200/pago-fallido")
                                .build()
                )
                .autoReturn("approved")
                .build();

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(request);

        return ResponseEntity.ok(Map.of("init_point", preference.getInitPoint()));
    }
}
