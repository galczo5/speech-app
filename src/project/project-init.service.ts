import {Injectable} from '@angular/core';
import {Project} from './project';
import {BoxRepositoryService} from '../boxes/box-repository.service';
import {ColorRepositoryService} from '../color/color-repository.service';
import {KeyframesRepositoryService} from '../keyframes/keyframes-repository.service';
import {LayersRepositoryService} from '../layers/layers-repository.service';
import {DocumentRepositoryService} from '../document/document-repository.service';
import {Observable, of} from 'rxjs';
import {BoxType, TextBox} from '../boxes/box';
import {boxes} from './initial-boxes';
import {keyframes} from './initial-keyframes';

@Injectable({
  providedIn: 'root'
})
export class ProjectInitService {

  constructor(private boxRepository: BoxRepositoryService,
              private colorRepository: ColorRepositoryService,
              private keyframesRepository: KeyframesRepositoryService,
              private layersRepository: LayersRepositoryService,
              private documentRepository: DocumentRepositoryService) {
  }

  create(): Observable<string> {
    const project = this.getNewProject();
    this.setupRepositories(project);
    return of(project.id);
  }

  setup(id: string): Observable<void> {
    const project = this.getProject(id);
    this.setupRepositories(project);
    return of(undefined);
  }

  private setupRepositories(project: Project): void {
    this.boxRepository.set(project.boxes);
    this.colorRepository.set(project.colors);
    this.keyframesRepository.set(project.keyframes);
    this.layersRepository.set(project.layers);
    this.documentRepository.set(project.document);
  }

  private getProject(id: string): Project {
    // TODO: Replace with api
    return JSON.parse(localStorage.getItem(id)) as Project;
  }

  private getNewProject(): Project {

    // TODO: Replace with API
    const project = {
      id: new Date().getTime().toString(),
      boxes,
      colors: [
        {id: '1', name: 'Black', value: '#000000'},
        {id: '2', name: 'White', value: '#FFFFFF'},
        {id: '3', name: 'Blue', value: '#007bff'}
      ],
      keyframes,
      layers: [],
      document: {
        name: 'Awesome brave new project',
        description: '',
        colorId: null
      }
    };

    localStorage.setItem(project.id, JSON.stringify(project));
    return project;
  }
}
