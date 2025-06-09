import { expect } from 'chai';
import { describe, it, beforeEach, before } from 'mocha';

describe('AdminService Tests', () => {
    let AdminService;
    let adminService;

    before(async () => {
        // Dynamically import the AdminService (CommonJS module)
        const module = await import('../srv/admin-service.js');
        AdminService = module.default;
    });

    beforeEach(() => {
        adminService = new AdminService();
    });

    it('should throw DEATH_BEFORE_BIRTH error if dateOfDeath is before dateOfBirth', () => {
        const req = {
            data: {
                dateOfBirth: '2000-01-01',
                dateOfDeath: '1999-12-31'
            },
            error: (code, params) => {
                throw { code, params };
            }
        };

        try {
            adminService.validateLifeData(req);
            // If no error is thrown, the test should fail
            expect.fail('Expected DEATH_BEFORE_BIRTH error to be thrown');
        } catch (err) {
            expect(err.code).to.equal('DEATH_BEFORE_BIRTH');
            expect(err.params).to.deep.equal(['1999-12-31', '2000-01-01']);
        }
    });

    it('should not throw an error if dateOfDeath is after dateOfBirth', () => {
        const req = {
            data: {
                dateOfBirth: '2000-01-01',
                dateOfDeath: '2001-01-01'
            },
            error: () => {
                throw new Error('Unexpected error');
            }
        };

        // This should not throw any error
        expect(() => adminService.validateLifeData(req)).to.not.throw();
    });

    it('should not throw an error if dateOfBirth or dateOfDeath is missing', () => {
        const req = {
            data: {
                dateOfBirth: '2000-01-01'
            },
            error: () => {
                throw new Error('Unexpected error');
            }
        };

        // This should not throw any error
        expect(() => adminService.validateLifeData(req)).to.not.throw();
    });
});