import { Component } from '@angular/core';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {
    route(page: number) {
        if (page == 1)
            window.location.pathname = './explore1'
        else if (page == 2)
            window.location.pathname = './explore2'
        else if (page == 3)
            window.location.pathname = './explore3'
        else if (page == 4)
            window.location.pathname = './explore4'
        else if (page == 5)
            window.location.pathname = './explore5'
        else if (page == 6)
            window.location.pathname = './explore6'
        else if (page == 7)
            window.location.pathname = './explore7'
    }
}
