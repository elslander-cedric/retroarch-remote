import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})

export class ConfirmModalComponent implements OnInit {

  public title : string;
  public message : string;

  @Input() name;
  constructor(public activeModal: NgbActiveModal) {}

  public ngOnInit() : void {}

}
