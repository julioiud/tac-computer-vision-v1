import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { PhotosService } from '../services/photos.service';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
})

export class ImageSelectorComponent  implements OnInit {

  selectedImage: any;
  isLoaded = false;
  result: any;
  image: any;

  ngOnInit() {}

  constructor(
    private loadingCtrl: LoadingController,
    private imageDetectionService: PhotosService) {

  }
  
  async takePicture(){
    

    this.selectedImage = ''

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageData = await Filesystem.readFile({
      path: image.path!
    });

    // Can be set to the src of an image now
    //imageElement.src = imageUrl;
    this.image = imageData;
    this.selectedImage = `data:image/jpeg;base64,${imageData.data}`;
  };

  async uploadImagen() {
    
    const loading = await this.loadingCtrl.create({
      message: 'Analizando...'
    });

    loading.present();
    

    if (this.image) {

      const { data } = this.image
      
      this.imageDetectionService.detectImage(this.selectedImage)
     .subscribe({
        next: async (response: any) => {
          
          console.log(response)
          
          this.result = JSON.stringify(
            response
          )
          if(response ) {
            const predicts = await response.predictions
            const cantidad = await predicts.length;
              if(cantidad > 0) {
                if(predicts[0].confidence > 0.85) {
                  this.result = 'Aguacate detectado';
                }else{
                  this.result = 'No se detectaron aguacates'
                }
              }else{
                this.result = 'No se detectaron aguacates'
              }
          } else{
            this.result = 'No se detectaron aguacates'
          }
          this.isLoaded = true
          loading.dismiss();
        },
        error: error => {
          this.isLoaded = true
          console.log(error);
          this.result = 'Hubo un error al intentar detectar'
          loading.dismiss();
        }
     })
    }
  }  
}
