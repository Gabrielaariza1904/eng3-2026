package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private Fachada fachada;

    @GetMapping("/kpis")
    public Map<String, Object> obterKpis() {
        List<Hospede> hospedes = fachada.consultar(new Hospede());
        List<Quarto> quartos = fachada.consultar(new Quarto());
        List<Reserva> reservas = fachada.consultar(new Reserva());
        List<Pagamento> pagamentos = fachada.consultar(new Pagamento());

        long activeGuests = hospedes.stream().filter(h -> !h.isInativo()).count();

        long totalRooms = quartos.size();
        long occupiedRooms = quartos.stream().filter(q -> q.getStatus() == StatusQuarto.OCUPADO).count();
        double occupancyRate = totalRooms > 0 ? Math.round(((double) occupiedRooms / totalRooms) * 100) : 0;

        LocalDate hoje = LocalDate.now();
        long checkinsToday = reservas.stream()
                .filter(r -> r.getDataEntrada().equals(hoje) && r.getStatus() != StatusReserva.CANCELADA)
                .count();

        double approvedRevenue = pagamentos.stream()
                .filter(p -> p.getStatus() == StatusPagamento.APROVADO)
                .mapToDouble(Pagamento::getValor)
                .sum();

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("activeGuests", activeGuests);
        kpis.put("occupancyRate", occupancyRate);
        kpis.put("occupiedRooms", occupiedRooms);
        kpis.put("totalRooms", totalRooms);
        kpis.put("checkinsToday", checkinsToday);
        kpis.put("approvedRevenue", approvedRevenue);

        return kpis;
    }

    @GetMapping("/atividades")
    public List<Atividade> obterAtividades() {
        List<Hospede> hospedes = fachada.consultar(new Hospede());
        List<Reserva> reservas = fachada.consultar(new Reserva());
        List<Pagamento> pagamentos = fachada.consultar(new Pagamento());

        List<Atividade> atividades = new ArrayList<>();

        // Add guest activities (last 3)
        List<Hospede> ultimosHospedes = hospedes.stream()
                .sorted(Comparator.comparing(Hospede::getId).reversed())
                .limit(3)
                .collect(Collectors.toList());
        for (Hospede h : ultimosHospedes) {
            atividades.add(new Atividade(
                    "hospede",
                    "Hóspede <strong>" + h.getNome() + "</strong> foi cadastrado no sistema.",
                    "Hoje",
                    "👥",
                    "bg-blue-100 text-blue-600"
            ));
        }

        // Add reservation activities (last 3)
        List<Reserva> últimasReservas = reservas.stream()
                .sorted(Comparator.comparing(Reserva::getId).reversed())
                .limit(3)
                .collect(Collectors.toList());
        for (Reserva r : últimasReservas) {
            String nomeHospede = r.getHospede() != null ? r.getHospede().getNome() : "Desconhecido";
            String numeroQuarto = r.getQuarto() != null ? r.getQuarto().getNumero() : "?";
            atividades.add(new Atividade(
                    "reserva",
                    "Reserva #" + r.getId() + " criada para <strong>" + nomeHospede + "</strong> (Quarto " + numeroQuarto + ").",
                    "Hoje",
                    "🔑",
                    "bg-indigo-100 text-indigo-600"
            ));
        }

        // Add payment activities (last 2)
        List<Pagamento> ultimosPagamentos = pagamentos.stream()
                .sorted(Comparator.comparing(Pagamento::getId).reversed())
                .limit(2)
                .collect(Collectors.toList());
        for (Pagamento p : ultimosPagamentos) {
            String valorFormatado = String.format("R$ %.2f", p.getValor());
            atividades.add(new Atividade(
                    "pagamento",
                    "Pagamento de <strong>" + valorFormatado + "</strong> recebido via " + p.getFormaPagamento() + ".",
                    "Hoje",
                    "💳",
                    "bg-emerald-100 text-emerald-600"
            ));
        }

        return atividades;
    }

    public static class Atividade {
        private String tipo;
        private String texto;
        private String data;
        private String icone;
        private String corIcone;

        public Atividade() {}

        public Atividade(String tipo, String texto, String data, String icone, String corIcone) {
            this.tipo = tipo;
            this.texto = texto;
            this.data = data;
            this.icone = icone;
            this.corIcone = corIcone;
        }

        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }

        public String getTexto() { return texto; }
        public void setTexto(String texto) { this.texto = texto; }

        public String getData() { return data; }
        public void setData(String data) { this.data = data; }

        public String getIcone() { return icone; }
        public void setIcone(String icone) { this.icone = icone; }

        public String getCorIcone() { return corIcone; }
        public void setCorIcone(String corIcone) { this.corIcone = corIcone; }
    }
}
