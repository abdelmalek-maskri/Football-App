import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITournament } from '../tournament.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tournament.test-samples';

import { TournamentService, RestTournament } from './tournament.service';

const requireRestSample: RestTournament = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
};

describe('Tournament Service', () => {
  let service: TournamentService;
  let httpMock: HttpTestingController;
  let expectedResult: ITournament | ITournament[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TournamentService);
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

    it('should create a Tournament', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tournament = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tournament).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tournament', () => {
      const tournament = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tournament).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tournament', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tournament', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Tournament', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTournamentToCollectionIfMissing', () => {
      it('should add a Tournament to an empty array', () => {
        const tournament: ITournament = sampleWithRequiredData;
        expectedResult = service.addTournamentToCollectionIfMissing([], tournament);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tournament);
      });

      it('should not add a Tournament to an array that contains it', () => {
        const tournament: ITournament = sampleWithRequiredData;
        const tournamentCollection: ITournament[] = [
          {
            ...tournament,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTournamentToCollectionIfMissing(tournamentCollection, tournament);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tournament to an array that doesn't contain it", () => {
        const tournament: ITournament = sampleWithRequiredData;
        const tournamentCollection: ITournament[] = [sampleWithPartialData];
        expectedResult = service.addTournamentToCollectionIfMissing(tournamentCollection, tournament);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tournament);
      });

      it('should add only unique Tournament to an array', () => {
        const tournamentArray: ITournament[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tournamentCollection: ITournament[] = [sampleWithRequiredData];
        expectedResult = service.addTournamentToCollectionIfMissing(tournamentCollection, ...tournamentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tournament: ITournament = sampleWithRequiredData;
        const tournament2: ITournament = sampleWithPartialData;
        expectedResult = service.addTournamentToCollectionIfMissing([], tournament, tournament2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tournament);
        expect(expectedResult).toContain(tournament2);
      });

      it('should accept null and undefined values', () => {
        const tournament: ITournament = sampleWithRequiredData;
        expectedResult = service.addTournamentToCollectionIfMissing([], null, tournament, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tournament);
      });

      it('should return initial array if no Tournament is added', () => {
        const tournamentCollection: ITournament[] = [sampleWithRequiredData];
        expectedResult = service.addTournamentToCollectionIfMissing(tournamentCollection, undefined, null);
        expect(expectedResult).toEqual(tournamentCollection);
      });
    });

    describe('compareTournament', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTournament(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTournament(entity1, entity2);
        const compareResult2 = service.compareTournament(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTournament(entity1, entity2);
        const compareResult2 = service.compareTournament(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTournament(entity1, entity2);
        const compareResult2 = service.compareTournament(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
