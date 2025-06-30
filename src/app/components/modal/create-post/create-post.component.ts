import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../../services/post/post.service';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule],

  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  postForm: FormGroup;
  imagenSeleccionada: File | null = null;

  constructor(
    private fb: FormBuilder,
    private postsService: PostService,
    public dialogRef: MatDialogRef<CreatePostComponent>
  ) {
    this.postForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.imagenSeleccionada = fileInput.files[0];
    }
  }

  onSubmit() {
  if (this.postForm.invalid) return;

  const formData = new FormData();
  formData.append('titulo', this.postForm.value.titulo);
  formData.append('descripcion', this.postForm.value.descripcion);

  if (this.imagenSeleccionada) {
    formData.append('imagen', this.imagenSeleccionada);
  }

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);  // ✅ Mostrará: titulo, descripcion, imagen
  }

  this.postsService.crearPublicacion(formData).subscribe({
    next: () => this.dialogRef.close(true),
    error: (err) => {
      console.error('Error al crear publicación', err); // 👈 importante
      this.dialogRef.close(false);
    },
  });
}


  
}
