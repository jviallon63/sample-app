import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { DataTableComponent, TableColumn } from './data-table.component';
import { NotificationService } from '../../services/notification.service';

interface Row {
  name: string;
}

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent<Row>>;
  let notifications: jasmine.SpyObj<NotificationService>;
  const columns: TableColumn<Row>[] = [{ key: 'name', header: 'Name', cell: (row) => row.name, sortable: true }];

  function create(fetcher: jasmine.Spy): void {
    fixture = TestBed.createComponent(DataTableComponent<Row>);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('fetcher', fetcher);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    notifications = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [provideNoopAnimations(), { provide: NotificationService, useValue: notifications }]
    }).compileComponents();
  });

  it('should fetch the first page and render rows', () => {
    const fetcher = jasmine.createSpy('fetcher').and.returnValue(of({ count: 1, items: [{ name: 'alpha' }] }));
    create(fetcher);

    expect(fetcher).toHaveBeenCalledWith({ page: 1, limit: 10, sort: undefined });
    expect(fixture.nativeElement.textContent).toContain('alpha');
  });

  it('should show an empty state when there is no data', () => {
    create(jasmine.createSpy('fetcher').and.returnValue(of({ count: 0, items: [] })));

    expect(fixture.nativeElement.textContent).toContain('There is no element to display.');
  });

  it('should notify when loading fails', () => {
    create(jasmine.createSpy('fetcher').and.returnValue(throwError(() => new Error('boom'))));

    expect(notifications.error).toHaveBeenCalledWith('Error while loading data', 'boom');
  });
});
