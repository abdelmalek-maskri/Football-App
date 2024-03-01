import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAvailableDate } from '../available-date.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../available-date.test-samples';

import { AvailableDateService, RestAvailableDate } from './available-date.service';

const requireRestSample: RestAvailableDate = {
  ...sampleWithRequiredData,
  fromTime: sampleWithRequiredData.fromTime?.toJSON(),
  toTime: sampleWithRequiredData.toTime?.toJSON(),
};

describe('AvailableDate Service', () => {
  let service: AvailableDateService;
  let httpMock: HttpTestingController;
  let expectedResult: IAvailableDate | IAvailableDate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AvailableDateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AvailableDate', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const availableDate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(availableDate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AvailableDate', () => {
      const availableDate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(availableDate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AvailableDate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AvailableDate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AvailableDate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAvailableDateToCollectionIfMissing', () => {
      it('should add a AvailableDate to an empty array', () => {
        const availableDate: IAvailableDate = sampleWithRequiredData;
        expectedResult = service.addAvailableDateToCollectionIfMissing([], availableDate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(availableDate);
      });

      it('should not add a AvailableDate to an array that contains it', () => {
        const availableDate: IAvailableDate = sampleWithRequiredData;
        const availableDateCollection: IAvailableDate[] = [
          {
            ...availableDate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAvailableDateToCollectionIfMissing(availableDateCollection, availableDate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AvailableDate to an array that doesn't contain it", () => {
        const availableDate: IAvailableDate = sampleWithRequiredData;
        const availableDateCollection: IAvailableDate[] = [sampleWithPartialData];
        expectedResult = service.addAvailableDateToCollectionIfMissing(availableDateCollection, availableDate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(availableDate);
      });

      it('should add only unique AvailableDate to an array', () => {
        const availableDateArray: IAvailableDate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const availableDateCollection: IAvailableDate[] = [sampleWithRequiredData];
        expectedResult = service.addAvailableDateToCollectionIfMissing(availableDateCollection, ...availableDateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const availableDate: IAvailableDate = sampleWithRequiredData;
        const availableDate2: IAvailableDate = sampleWithPartialData;
        expectedResult = service.addAvailableDateToCollectionIfMissing([], availableDate, availableDate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(availableDate);
        expect(expectedResult).toContain(availableDate2);
      });

      it('should accept null and undefined values', () => {
        const availableDate: IAvailableDate = sampleWithRequiredData;
        expectedResult = service.addAvailableDateToCollectionIfMissing([], null, availableDate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(availableDate);
      });

      it('should return initial array if no AvailableDate is added', () => {
        const availableDateCollection: IAvailableDate[] = [sampleWithRequiredData];
        expectedResult = service.addAvailableDateToCollectionIfMissing(availableDateCollection, undefined, null);
        expect(expectedResult).toEqual(availableDateCollection);
      });
    });

    describe('compareAvailableDate', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAvailableDate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAvailableDate(entity1, entity2);
        const compareResult2 = service.compareAvailableDate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAvailableDate(entity1, entity2);
        const compareResult2 = service.compareAvailableDate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAvailableDate(entity1, entity2);
        const compareResult2 = service.compareAvailableDate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
