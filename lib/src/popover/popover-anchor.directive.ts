import { Directive, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output, ViewContainerRef } from '@angular/core';
import { tap, takeUntil } from 'rxjs/operators';

import { PopoverContentComponent } from './popover.component';
import { getInvalidPopoverError } from './popover.errors';
import { PopoverAnchoringService } from './popover-anchoring.service';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';

@Directive({
    selector: '[hcPopover]',
    providers: [PopoverAnchoringService]
})
export class PopoverDirective implements OnInit, OnDestroy {
    /** Emits when the directive is destroyed. */
    private _onDestroy = new Subject<void>();

    private _attachedPopover: PopoverContentComponent;

    /** Reference to the popover instance. */
    @Input('hcPopover')
    get attachedPopover() {
        return this._attachedPopover;
    }
    set attachedPopover(value: PopoverContentComponent) {
        this._validateAttachedPopover(value);
        this._attachedPopover = value;
        // Anchor the popover to the element ref
        this._anchoring.anchor(this.attachedPopover, this._viewContainerRef, this._elementRef);
    }

    /** Emits when the popover is opened. */
    @Output() popoverOpened = new EventEmitter<void>();

    /** Emits when the popover is closed. */
    @Output() popoverClosed = new EventEmitter<any>();

    /** Gets whether the popover is presently open. */
    isPopoverOpen(): boolean {
        return this._anchoring.isPopoverOpen();
    }

    constructor(
        private _elementRef: ElementRef,
        private _viewContainerRef: ViewContainerRef,
        public _anchoring: PopoverAnchoringService
    ) {}

    ngOnInit() {
        // Re-emit open and close events
        const opened$ = this._anchoring.popoverOpened.pipe(tap(() => this.popoverOpened.emit()));
        const closed$ = this._anchoring.popoverClosed.pipe(tap(value => this.popoverClosed.emit(value)));
        merge(opened$, closed$)
            .pipe(takeUntil(this._onDestroy))
            .subscribe();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /** Toggles the popover between the open and closed states. */
    togglePopover(): void {
        this._anchoring.togglePopover();
    }

    /** Opens the popover. */
    openPopover(): void {
        this._anchoring.openPopover();
    }

    /** Closes the popover. */
    closePopover(value?: any): void {
        this._anchoring.closePopover(value);
    }

    /** Throws an error if the popover instance is not provided. */
    private _validateAttachedPopover(popover: PopoverContentComponent): void {
        if (!popover || !(popover instanceof PopoverContentComponent)) {
            throw getInvalidPopoverError();
        }
    }
}
