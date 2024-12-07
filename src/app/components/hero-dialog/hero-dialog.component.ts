import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroModel } from '../../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DialogModeEnum } from '../../enums';

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],  standalone: true,
  selector: 'app-hero-dialog',
  templateUrl: './hero-dialog.component.html',
  styleUrls: ['./hero-dialog.component.scss']
})
export class HeroDialogComponent {
  heroForm: FormGroup | undefined;
  dialogMode: DialogModeEnum = DialogModeEnum.Details;
  dialogModeEnum = DialogModeEnum;
  
constructor(
  private fb: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: { hero?: HeroModel, dialogMode: DialogModeEnum },
  private dialogRef: MatDialogRef<HeroDialogComponent>
) {
  this.dialogMode = data.dialogMode;
  if (this.dialogMode === DialogModeEnum.Edit && data.hero) {
    this.heroForm = this.fb.group({
      nameLabel: [data.hero.nameLabel, Validators.required],
      genderLabel: [data.hero.genderLabel, Validators.required],
      citizenshipLabel: [data.hero.citizenshipLabel, Validators.required],
      skillsLabel: [data.hero.skillsLabel, Validators.required],
    });
  } else if(this.dialogMode === DialogModeEnum.Add) {
    this.heroForm = this.fb.group({
      nameLabel: ['', Validators.required],
      genderLabel: ['', Validators.required],
      citizenshipLabel: ['', Validators.required],
      skillsLabel: ['', Validators.required],
    });
  }
}

  onSave(): void {
    if (this.heroForm?.valid) {
      const updatedHero: HeroModel = { ...this.heroForm.value, id: this.dialogMode === DialogModeEnum.Edit ? this.data.hero?.id : this.generateUniqueId() };
      this.dialogRef.close(updatedHero); 
    }
  }

  generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9); 
  }
}
