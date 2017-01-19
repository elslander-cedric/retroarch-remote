import { TestBed, async } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '@angular/material';

describe('Dashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule.forRoot()
      ],
      declarations: [
        DashboardComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the dashboard', async(() => {
    let fixture = TestBed.createComponent(DashboardComponent);
    let dashboard = fixture.debugElement.componentInstance;
    expect(dashboard).toBeTruthy();
  }));

  it('should render subtitle in a h2 tag', async(() => {
    let fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Dashboard');
  }));
});
