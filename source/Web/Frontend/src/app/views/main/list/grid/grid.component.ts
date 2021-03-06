import { Component } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { GridParametersModel } from "src/app/components/grid/grid-parameters.model";
import { GridModel } from "src/app/components/grid/grid.model";
import { UserModel } from "src/app/models/user.model";
import { AppUserService } from "src/app/services/user.service";

@Component({
    selector: "app-list-grid",
    templateUrl: "./grid.component.html"
})
export class AppListGridComponent {
    filters = this.formBuilder.group({
        Id: new FormControl(),
        FirstName: new FormControl(),
        Email: new FormControl()
    });

    grid = new GridModel<UserModel>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly appUserService: AppUserService) {
        this.init();
    }

    private init() {
        this.grid.parameters.order.property = "Id";
        this.filters.valueChanges.pipe(debounceTime(0)).subscribe(() => this.filter());
        this.load();
    }

    private filter() {
        this.grid.parameters = new GridParametersModel();
        this.grid.parameters.filters.addFromFormGroup(this.filters);
        this.load();
    }

    load() {
        this.appUserService.grid(this.grid.parameters).subscribe((grid) => this.grid = grid);
    }
}
