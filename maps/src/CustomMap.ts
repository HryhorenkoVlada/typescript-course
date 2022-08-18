
interface Mappable {
    location: {
        lat: number,
        lng: number,
    },
    markerContent(): string

}

export class CustomMap {
    private gopgleMap: google.maps.Map;

    constructor(containerId: string) {
        this.gopgleMap = new google.maps.Map(document.getElementById(containerId) as HTMLElement, {zoom: 1, center: { lat: 0, lng: 0}})
    }

    addMarker (mappable: Mappable ):void {
        const marker = new google.maps.Marker({
            map: this.gopgleMap,
            position: {
                lat: mappable.location.lat,
                lng: mappable.location.lng
            }
        })

        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: mappable.markerContent()
            })
            infoWindow.open(this.gopgleMap, marker)
        })
    }

    // addCompanyMarker (company: Company): void {
    //     new google.maps.Marker({
    //         map: this.gopgleMap,
    //         position: {
    //             lat: company.location.lat,
    //             lng: company.location.lng
    //         }
    //     })
    // }
}