namespace com.sap.learning;

using {
    cuid,
    managed,
    Currency,
    Country,
    sap.common.CodeList
} from '@sap/cds/common';


entity Books : cuid, managed {
    title       : localized String(255) @mandatory;
    author      : Association to Authors  @mandatory  @assert.target;
    publisher   : Association to Publishers @assert.target;
    genre       : Genre                 @assert.range: true;
    publCountry : Country;
    stock       : NoOfBooks default 0;
    price       : Price;
    isHardcover : Boolean;
}

type Genre     : Integer enum {
    fiction     = 1;
    non_fiction = 2;
}

type NoOfBooks : Integer;

type Price {
    amount   : Decimal;
    currency : Currency;
}


entity Authors : cuid, managed {
    name        : String(100)           @mandatory;
    dateOfBirth : Date;
    dateOfDeath : Date;
    epoch       : Association to Epochs @assert.target;
    books       : Association to many Books
                      on books.author = $self;
}

entity Epochs : CodeList {
    key ID : Integer;
}


entity Publishers : cuid, managed {
    name        : String(100) @mandatory;
    countryCode : String(3);
    books       : Association to many Books
                    on books.publisher = $self;
}

annotate Books with {
    modifiedAt @odata.etag
}

annotate Authors with {
    modifiedAt @odata.etag
}

annotate Publishers with {
    modifiedAt @odata.etag
}
