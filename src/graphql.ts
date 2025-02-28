import { gql } from '@apollo/client';

export const FETCH_SATELLITE = gql`
    query FetchSatellite($id: Int!) {
        satellite(id: $id) {
            satelliteId
            title
            description
            fullDesc
            imageUrl
            weight
            orbit
            expectedDate
        }
    }
`;

export const CREATE_SATELLITE = gql`
    mutation CreateSatellite(
        $title: String!, 
        $weight: Int!, 
        $fullDesc: String, 
        $description: String,
        $imageUrl: String,
        $orbit: String,
        $expectedDate: Date
    ) {
        createSatellite(
            title: $title, 
            weight: $weight, 
            fullDesc: $fullDesc, 
            description: $description,
            imageUrl: $imageUrl,
            orbit: $orbit,
            expectedDate: $expectedDate
        ) {
            satellite {
                satelliteId
                title
                fullDesc
                description
                imageUrl
                weight
                orbit
                expectedDate
            }
        }
    }
`;