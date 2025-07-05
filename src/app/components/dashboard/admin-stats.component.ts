// src/app/pages/admin-stats/admin-stats.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './admin-stats.component.html',
})
export class AdminStatsComponent implements OnInit {
  apiUrl = environment.apiUrl;
  from = new Date().toISOString().slice(0, 10);
  to = new Date().toISOString().slice(0, 10);

  publicacionesChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ label: 'Publicaciones', data: [] }],
  };

  comentariosChart: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ label: 'Comentarios', data: [] }],
  };

  comentariosPorPostChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ label: 'Comentarios/Post', data: [] }],
  };

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const params = new HttpParams().set('from', this.from).set('to', this.to);

    this.http
      .get<any>(`${this.apiUrl}/estadisticas/publicaciones`, {
        params,
        headers: this.auth.getAuthHeaders(),
      })
      .subscribe((res) => {
        this.publicacionesChart.labels = res.labels;
        this.publicacionesChart.datasets[0].data = res.valores;
      });

    this.http
      .get<any>(`${this.apiUrl}/estadisticas/comentarios`, {
        params,
        headers: this.auth.getAuthHeaders(),
      })
      .subscribe((res) => {
        this.comentariosChart.labels = res.labels;
        this.comentariosChart.datasets[0].data = res.valores;
      });

    this.http
      .get<any>(`${this.apiUrl}/estadisticas/comentarios-por-post`, {
        params,
        headers: this.auth.getAuthHeaders(),
      })
      .subscribe((res) => {
        this.comentariosPorPostChart.labels = res.labels;
        this.comentariosPorPostChart.datasets[0].data = res.valores;
      });
  }
}
