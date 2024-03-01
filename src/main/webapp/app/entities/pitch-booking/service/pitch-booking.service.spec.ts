import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPitchBooking } from '../pitch-booking.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pitch-booking.test-samples';

import { PitchBookingService, RestPitchBooking } from './pitch-booking.service';

const requireRestSample: RestPitchBooking = {
  ...sampleWithRequiredData,
  bookingDate: sampleWithRequiredData.bookingDate?.toJSON(),
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('PitchBooking Service', () => {
  let service: PitchBookingService;
  let httpMock: HttpTestingController;
  let expectedResult: IPitchBooking | IPitchBooking[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PitchBookingService);
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

    it('should create a PitchBooking', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pitchBooking = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pitchBooking).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PitchBooking', () => {
      const pitchBooking = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pitchBooking).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PitchBooking', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PitchBooking', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PitchBooking', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPitchBookingToCollectionIfMissing', () => {
      it('should add a PitchBooking to an empty array', () => {
        const pitchBooking: IPitchBooking = sampleWithRequiredData;
        expectedResult = service.addPitchBookingToCollectionIfMissing([], pitchBooking);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pitchBooking);
      });

      it('should not add a PitchBooking to an array that contains it', () => {
        const pitchBooking: IPitchBooking = sampleWithRequiredData;
        const pitchBookingCollection: IPitchBooking[] = [
          {
            ...pitchBooking,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPitchBookingToCollectionIfMissing(pitchBookingCollection, pitchBooking);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PitchBooking to an array that doesn't contain it", () => {
        const pitchBooking: IPitchBooking = sampleWithRequiredData;
        const pitchBookingCollection: IPitchBooking[] = [sampleWithPartialData];
        expectedResult = service.addPitchBookingToCollectionIfMissing(pitchBookingCollection, pitchBooking);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pitchBooking);
      });

      it('should add only unique PitchBooking to an array', () => {
        const pitchBookingArray: IPitchBooking[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pitchBookingCollection: IPitchBooking[] = [sampleWithRequiredData];
        expectedResult = service.addPitchBookingToCollectionIfMissing(pitchBookingCollection, ...pitchBookingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pitchBooking: IPitchBooking = sampleWithRequiredData;
        const pitchBooking2: IPitchBooking = sampleWithPartialData;
        expectedResult = service.addPitchBookingToCollectionIfMissing([], pitchBooking, pitchBooking2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pitchBooking);
        expect(expectedResult).toContain(pitchBooking2);
      });

      it('should accept null and undefined values', () => {
        const pitchBooking: IPitchBooking = sampleWithRequiredData;
        expectedResult = service.addPitchBookingToCollectionIfMissing([], null, pitchBooking, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pitchBooking);
      });

      it('should return initial array if no PitchBooking is added', () => {
        const pitchBookingCollection: IPitchBooking[] = [sampleWithRequiredData];
        expectedResult = service.addPitchBookingToCollectionIfMissing(pitchBookingCollection, undefined, null);
        expect(expectedResult).toEqual(pitchBookingCollection);
      });
    });

    describe('comparePitchBooking', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePitchBooking(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePitchBooking(entity1, entity2);
        const compareResult2 = service.comparePitchBooking(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePitchBooking(entity1, entity2);
        const compareResult2 = service.comparePitchBooking(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePitchBooking(entity1, entity2);
        const compareResult2 = service.comparePitchBooking(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
