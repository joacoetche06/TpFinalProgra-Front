// src/app/pages/admin-stats/admin-stats.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Chart as ChartJS,
  ChartConfiguration,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from 'chart.js';

ChartJS.register(
  BarController, // Add this
  LineController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.css'],
})
export class AdminStatsComponent implements OnInit {
  apiUrl = environment.apiUrl;
  from = new Date().toISOString().slice(0, 10);
  to = new Date().toISOString().slice(0, 10);

  publicacionesChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Publicaciones',
        data: [],
        backgroundColor: '#c62828', // rojo fuerte
      },
    ],
  };

  comentariosChart: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Comentarios',
        data: [],
        borderColor: '#0d6efd', // azul fuerte
        backgroundColor: '#0d6efd',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#0d6efd',
      },
    ],
  };

  comentariosPorPostChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Comentarios/Post',
        data: [],
        backgroundColor: '#2e7d32', // verde
      },
    ],
  };

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const params = new HttpParams().set('from', this.from).set('to', this.to);

    this.http
      .get<any[]>(`${this.apiUrl}/estadisticas/publicaciones-por-usuario`, {
        params,
        headers: this.auth.getAuthHeaders(),
      })
      .subscribe((res) => {
        this.publicacionesChart = {
          labels: res.map((item) => item.username),
          datasets: [
            {
              ...this.publicacionesChart.datasets[0],
              data: res.map((item) => item.total),
            },
          ],
        };
      });

    // Hacer lo mismo para los otros gráficos
    this.http
      .get<any[]>(`${this.apiUrl}/estadisticas/comentarios-por-dia`, {
        params,
        headers: this.auth.getAuthHeaders(),
      })
      .subscribe((res) => {
        this.comentariosChart = {
          labels: res.map((item) => item._id),
          datasets: [
            {
              ...this.comentariosChart.datasets[0],
              data: res.map((item) => item.total),
            },
          ],
        };
      });

    this.http
      .get<any[]>(`${this.apiUrl}/estadisticas/comentarios-por-publicacion`, {
        params,
        headers: this.auth.getAuthHeaders(),
      })
      .subscribe((res) => {
        this.comentariosPorPostChart = {
          labels: res.map((item) => item._id),
          datasets: [
            {
              ...this.comentariosPorPostChart.datasets[0],
              data: res.map((item) => item.total),
            },
          ],
        };
      });
  }
}
