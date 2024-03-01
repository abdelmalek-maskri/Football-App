import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPitch } from '../pitch.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pitch.test-samples';

import { PitchService } from './pitch.service';

const requireRestSample: IPitch = {
  ...sampleWithRequiredData,
};

describe('Pitch Service', () => {
  let service: PitchService;
  let httpMock: HttpTestingController;
  let expectedResult: IPitch | IPitch[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PitchService);
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

    it('should create a Pitch', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pitch = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pitch).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pitch', () => {
      const pitch = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pitch).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pitch', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pitch', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pitch', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPitchToCollectionIfMissing', () => {
      it('should add a Pitch to an empty array', () => {
        const pitch: IPitch = sampleWithRequiredData;
        expectedResult = service.addPitchToCollectionIfMissing([], pitch);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pitch);
      });

      it('should not add a Pitch to an array that contains it', () => {
        const pitch: IPitch = sampleWithRequiredData;
        const pitchCollection: IPitch[] = [
          {
            ...pitch,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPitchToCollectionIfMissing(pitchCollection, pitch);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pitch to an array that doesn't contain it", () => {
        const pitch: IPitch = sampleWithRequiredData;
        const pitchCollection: IPitch[] = [sampleWithPartialData];
        expectedResult = service.addPitchToCollectionIfMissing(pitchCollection, pitch);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pitch);
      });

      it('should add only unique Pitch to an array', () => {
        const pitchArray: IPitch[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pitchCollection: IPitch[] = [sampleWithRequiredData];
        expectedResult = service.addPitchToCollectionIfMissing(pitchCollection, ...pitchArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pitch: IPitch = sampleWithRequiredData;
        const pitch2: IPitch = sampleWithPartialData;
        expectedResult = service.addPitchToCollectionIfMissing([], pitch, pitch2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pitch);
        expect(expectedResult).toContain(pitch2);
      });

      it('should accept null and undefined values', () => {
        const pitch: IPitch = sampleWithRequiredData;
        expectedResult = service.addPitchToCollectionIfMissing([], null, pitch, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pitch);
      });

      it('should return initial array if no Pitch is added', () => {
        const pitchCollection: IPitch[] = [sampleWithRequiredData];
        expectedResult = service.addPitchToCollectionIfMissing(pitchCollection, undefined, null);
        expect(expectedResult).toEqual(pitchCollection);
      });
    });

    describe('comparePitch', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePitch(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePitch(entity1, entity2);
        const compareResult2 = service.comparePitch(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePitch(entity1, entity2);
        const compareResult2 = service.comparePitch(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePitch(entity1, entity2);
        const compareResult2 = service.comparePitch(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
