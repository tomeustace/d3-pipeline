import { Component, NgZone } from '@angular/core';
import { loadPipeline, processing } from './pipeline/pipeline';
import { loadProcessor, operationSuccess, operationError } from './pipeline/processor';
import { initNodes } from './pipeline/collision';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  nodeCount: number;

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.zone.runOutsideAngular(function() {
      loadPipeline();
      loadProcessor();
    })
  }

  nodesAdded(nodeCount) {
    this.nodeCount = nodeCount;
    initNodes(nodeCount);
  }

  update() {
    processing(this.nodeCount);
  }

  success() {
    operationSuccess();
  }

  error() {
    operationError();
  }
}
