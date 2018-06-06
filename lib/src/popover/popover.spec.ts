import { ElementRef, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    OverlayContainer,
    ConnectedPositionStrategy,
    RepositionScrollStrategy,
    BlockScrollStrategy,
    OverlayRef
} from '@angular/cdk/overlay';
import { ESCAPE, A } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs/Subject';

import { PopoverModule } from './popover.module';
import { PopoverContentComponent } from './popover.component';
import { PopoverDirective } from './popover-anchor.directive';
import {
    getInvalidPopoverError,
    getUnanchoredPopoverError,
    getInvalidHorizontalAlignError,
    getInvalidVerticalAlignError,
    getInvalidScrollStrategyError
} from './popover.errors';

describe('SatPopover', () => {
    describe('passing to anchor', () => {
        let fixture: ComponentFixture<any>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PopoverModule],
                declarations: [InvalidPopoverTestComponent, SimplePopoverTestComponent, AnchorlessPopoverTestComponent]
            });
        });

        it('should throw an error if an invalid object is provided', () => {
            fixture = TestBed.createComponent(InvalidPopoverTestComponent);

            expect(() => {
                fixture.detectChanges();
            }).toThrow(getInvalidPopoverError());
        });

        it('should not throw an error if a valid popover is provided', () => {
            fixture = TestBed.createComponent(SimplePopoverTestComponent);

            expect(() => {
                fixture.detectChanges();
            }).not.toThrowError();
        });

        it('should throw an error if open is called on a popover with no anchor', () => {
            fixture = TestBed.createComponent(AnchorlessPopoverTestComponent);

            // should not throw when just initializing
            expect(() => {
                fixture.detectChanges();
            }).not.toThrowError();

            // should throw if it is opening
            expect(() => {
                fixture.componentInstance.popover.open();
            }).toThrow(getUnanchoredPopoverError());
        });
    });

    describe('opening and closing behavior', () => {
        let fixture: ComponentFixture<SimplePopoverTestComponent>;
        let comp: SimplePopoverTestComponent;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PopoverModule, NoopAnimationsModule],
                declarations: [SimplePopoverTestComponent],
                providers: [{ provide: OverlayContainer, useFactory: overlayContainerFactory }]
            });

            fixture = TestBed.createComponent(SimplePopoverTestComponent);
            comp = fixture.componentInstance;

            overlayContainerElement = fixture.debugElement.injector.get(OverlayContainer).getContainerElement();
        });

        afterEach(() => {
            document.body.removeChild(overlayContainerElement);
        });

        it('should open with open()', () => {
            fixture.detectChanges();
            expect(overlayContainerElement.textContent).toBe('', 'Initially closed');
            comp.popover.open();
            expect(overlayContainerElement.textContent).toContain('Popover', 'Subsequently open');
        });

        it('should open with openPopover()', () => {
            fixture.detectChanges();
            expect(overlayContainerElement.textContent).toBe('', 'Initially closed');
            comp.anchor.openPopover();
            expect(overlayContainerElement.textContent).toContain('Popover', 'Subsequently open');
        });

        it(
            'should close with close()',
            fakeAsync(() => {
                fixture.detectChanges();
                comp.popover.open();
                expect(overlayContainerElement.textContent).toContain('Popover', 'Initially open');

                comp.popover.close();
                fixture.detectChanges();
                tick();
                expect(overlayContainerElement.textContent).toBe('', 'Subsequently closed');
            })
        );

        it(
            'should close with closePopover()',
            fakeAsync(() => {
                fixture.detectChanges();
                comp.anchor.openPopover();
                expect(overlayContainerElement.textContent).toContain('Popover', 'Initially open');

                comp.anchor.closePopover();
                fixture.detectChanges();
                tick();
                expect(overlayContainerElement.textContent).toBe('', 'Subsequently closed');
            })
        );

        it(
            'should toggle with toggle()',
            fakeAsync(() => {
                fixture.detectChanges();
                expect(overlayContainerElement.textContent).toBe('', 'Initially closed');

                comp.popover.toggle();
                expect(overlayContainerElement.textContent).toContain('Popover', 'Subsequently open');

                comp.popover.toggle();
                fixture.detectChanges();
                tick();
                expect(overlayContainerElement.textContent).toBe('', 'Closed after second toggle');
            })
        );

        it(
            'should toggle with togglePopover()',
            fakeAsync(() => {
                fixture.detectChanges();
                expect(overlayContainerElement.textContent).toBe('', 'Initially closed');

                comp.anchor.togglePopover();
                expect(overlayContainerElement.textContent).toContain('Popover', 'Subsequently open');

                comp.anchor.togglePopover();
                fixture.detectChanges();
                tick();
                expect(overlayContainerElement.textContent).toBe('', 'Closed after second toggle');
            })
        );

        it(
            'should emit when opened',
            fakeAsync(() => {
                fixture.detectChanges();
                let popoverOpenedEvent = false;
                let anchorOpenedEvent = false;
                let popoverAfterOpenEvent = false;

                comp.popover.opened.subscribe(() => (popoverOpenedEvent = true));
                comp.anchor.popoverOpened.subscribe(() => (anchorOpenedEvent = true));
                comp.popover.afterOpen.subscribe(() => (popoverAfterOpenEvent = true));

                comp.popover.open();

                expect(popoverOpenedEvent).toBe(true, 'popoverOpened called');
                expect(anchorOpenedEvent).toBe(true, 'anchorOpened called');
                expect(popoverAfterOpenEvent).toBe(false, 'popoverAfterOpen not yet called');

                tick();
                expect(popoverAfterOpenEvent).toBe(true, 'popoverAfterOpen called after animation');
            })
        );

        it(
            'should emit when closed',
            fakeAsync(() => {
                fixture.detectChanges();
                comp.popover.open();

                let popoverClosedEvent = false;
                let anchorClosedEvent = false;
                let popoverAfterCloseEvent = false;

                comp.popover.closed.subscribe(() => (popoverClosedEvent = true));
                comp.anchor.popoverClosed.subscribe(() => (anchorClosedEvent = true));
                comp.popover.afterClose.subscribe(() => (popoverAfterCloseEvent = true));

                comp.popover.close();
                fixture.detectChanges();

                expect(popoverClosedEvent).toBe(true, 'popoverClosed called');
                expect(anchorClosedEvent).toBe(true, 'anchorClosed called');
                expect(popoverAfterCloseEvent).toBe(false, 'popoverAfterClose not yet called');

                tick();
                expect(popoverAfterCloseEvent).toBe(true, 'popoverAfterClose called after animation');
            })
        );

        it(
            'should emit a value when closed with a value',
            fakeAsync(() => {
                fixture.detectChanges();
                comp.popover.open();

                const firstTestVal = 'abc123';
                const secondTestVal = 'xyz789';

                let popoverClosedValue;
                let anchorClosedValue;

                comp.popover.closed.subscribe(val => (popoverClosedValue = val));
                comp.anchor.popoverClosed.subscribe(val => (anchorClosedValue = val));

                comp.anchor.closePopover(firstTestVal);
                fixture.detectChanges();
                tick();

                // Working when closed via anchor api
                expect(popoverClosedValue).toBe(firstTestVal, 'popoverClosed with value - anchor api');
                expect(anchorClosedValue).toBe(firstTestVal, 'anchorClosed with value - anchor api');

                comp.popover.open();
                fixture.detectChanges();

                comp.popover.close(secondTestVal);
                fixture.detectChanges();
                tick();

                // Working when closed via popover api
                expect(popoverClosedValue).toBe(secondTestVal, 'popoverClosed with value - popover api');
                expect(anchorClosedValue).toBe(secondTestVal, 'anchorClosed with value - popover api');
            })
        );

        it(
            'should return whether the popover is presently open',
            fakeAsync(() => {
                fixture.detectChanges();

                expect(comp.anchor.isPopoverOpen()).toBe(false, 'Initially closed - anchor');
                expect(comp.popover.isOpen()).toBe(false, 'Initially closed - popover');

                comp.popover.open();

                expect(comp.anchor.isPopoverOpen()).toBe(true, 'Subsequently opened - anchor');
                expect(comp.popover.isOpen()).toBe(true, 'Subsequently opened - popover');

                comp.popover.close();
                fixture.detectChanges();
                tick();

                expect(comp.anchor.isPopoverOpen()).toBe(false, 'Finally closed - anchor');
                expect(comp.popover.isOpen()).toBe(false, 'Finally closed - popover');
            })
        );
    });

    describe('backdrop', () => {
        let fixture: ComponentFixture<BackdropPopoverTestComponent>;
        let comp: BackdropPopoverTestComponent;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PopoverModule, NoopAnimationsModule],
                declarations: [BackdropPopoverTestComponent],
                providers: [{ provide: OverlayContainer, useFactory: overlayContainerFactory }]
            });

            fixture = TestBed.createComponent(BackdropPopoverTestComponent);
            comp = fixture.componentInstance;

            overlayContainerElement = fixture.debugElement.injector.get(OverlayContainer).getContainerElement();
        });

        afterEach(() => {
            document.body.removeChild(overlayContainerElement);
        });

        it('should have no backdrop by default', () => {
            fixture.detectChanges();
            comp.popover.open();

            const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
            expect(backdrop).toBeFalsy();
        });

        it('should allow adding a transparent backdrop', () => {
            comp.backdrop = true;
            fixture.detectChanges();
            comp.popover.open();

            const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
            expect(backdrop).toBeTruthy();
        });

        it(
            'should emit an event when the backdrop is clicked',
            fakeAsync(() => {
                comp.backdrop = true;
                fixture.detectChanges();
                comp.popover.open();

                const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
                expect(comp.clicks).toBe(0, 'not yet clicked');

                backdrop.click();
                fixture.detectChanges();
                expect(comp.clicks).toBe(1, 'clicked once');
                tick(500);
            })
        );

        it(
            'should close when backdrop is clicked',
            fakeAsync(() => {
                comp.backdrop = true;
                fixture.detectChanges();
                comp.popover.open();

                const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
                backdrop.click();
                fixture.detectChanges();
                tick(500);

                expect(overlayContainerElement.textContent).toBe('');
            })
        );

        it(
            'should not close when interactiveClose is false',
            fakeAsync(() => {
                comp.backdrop = true;
                comp.popover.interactiveClose = false;
                fixture.detectChanges();
                comp.popover.open();

                const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
                expect(comp.clicks).toBe(0, 'Not yet clicked');
                backdrop.click();
                fixture.detectChanges();
                tick(500);

                expect(overlayContainerElement.textContent).toContain('Popover', 'Interactive close disabled');

                comp.popover.interactiveClose = true;
                backdrop.click();
                fixture.detectChanges();
                tick(500);

                expect(comp.clicks).toBe(2, 'Clicked twice');
                expect(overlayContainerElement.textContent).toBe('', 'Interactive close allowed');
            })
        );

        it('should allow a custom backdrop to be added', () => {
            comp.backdrop = true;
            comp.klass = 'test-custom-class';
            fixture.detectChanges();
            comp.popover.open();

            const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
            expect(backdrop.classList.contains('test-custom-class')).toBe(true);
        });
    });

    describe('keyboard', () => {
        let fixture: ComponentFixture<KeyboardPopoverTestComponent>;
        let comp: KeyboardPopoverTestComponent;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PopoverModule, NoopAnimationsModule],
                declarations: [KeyboardPopoverTestComponent, FocusPopoverTestComponent],
                providers: [{ provide: OverlayContainer, useFactory: overlayContainerFactory }]
            });

            fixture = TestBed.createComponent(KeyboardPopoverTestComponent);
            comp = fixture.componentInstance;

            overlayContainerElement = fixture.debugElement.injector.get(OverlayContainer).getContainerElement();
        });

        afterEach(() => {
            document.body.removeChild(overlayContainerElement);
        });

        it(
            'should close when escape key is pressed',
            fakeAsync(() => {
                fixture.detectChanges();
                comp.popover.open();

                // Let focus move to the first focusable element
                fixture.detectChanges();
                tick();

                expect(overlayContainerElement.textContent).toContain('Popover', 'Initially open');

                // Emit ESCAPE keydown event
                const currentlyFocusedElement = document.activeElement;
                expect(currentlyFocusedElement.classList).toContain('first', 'Ensure input is focused');
                currentlyFocusedElement.dispatchEvent(createKeyboardEvent('keydown', ESCAPE));

                fixture.detectChanges();
                tick(500);

                expect(overlayContainerElement.textContent).toBe('', 'Closed after escape keydown');
            })
        );

        it(
            'should not close when interactiveClose is false',
            fakeAsync(() => {
                comp.popover.interactiveClose = false;
                fixture.detectChanges();
                comp.popover.open();

                // Let focus move to the first focusable element
                fixture.detectChanges();
                tick();

                expect(overlayContainerElement.textContent).toContain('Popover', 'Initially open');

                // Emit ESCAPE keydown event
                const currentlyFocusedElement = document.activeElement;
                expect(currentlyFocusedElement.classList).toContain('first', 'Ensure input is focused');
                currentlyFocusedElement.dispatchEvent(createKeyboardEvent('keydown', ESCAPE));

                fixture.detectChanges();
                tick(500);

                expect(comp.lastKeyCode).toBe(ESCAPE, 'Keydown still captured');
                expect(overlayContainerElement.textContent).toContain('Popover', 'Interactive close disabled');

                comp.popover.interactiveClose = true;
                currentlyFocusedElement.dispatchEvent(createKeyboardEvent('keydown', ESCAPE));
                fixture.detectChanges();
                tick(500);

                expect(overlayContainerElement.textContent).toBe('', 'Interactive close allowed');
            })
        );

        it(
            'should emit keydown events when key is pressed',
            fakeAsync(() => {
                fixture.detectChanges();
                comp.popover.open();

                // Let focus move to the first focusable element
                fixture.detectChanges();
                tick();

                expect(comp.lastKeyCode).toBe(undefined, 'no key presses yet');

                // Emit A keydown event on input element
                const currentlyFocusedElement = document.activeElement;
                currentlyFocusedElement.dispatchEvent(createKeyboardEvent('keydown', A));

                fixture.detectChanges();
                expect(comp.lastKeyCode).toBe(A, 'pressed A key on input');

                // Emit ESCAPE keydown event on body
                document.body.dispatchEvent(createKeyboardEvent('keydown', ESCAPE));
                fixture.detectChanges();
                expect(comp.lastKeyCode).toBe(ESCAPE, 'pressed ESCAPE key on body');

                tick(500);
            })
        );

        it(
            'should focus the initial element by default',
            fakeAsync(() => {
                const focusFixture = TestBed.createComponent(FocusPopoverTestComponent);
                const focusComp = focusFixture.componentInstance;

                focusFixture.detectChanges();
                focusComp.defaultPopoverAnchor.nativeElement.focus();
                focusComp.defaultPopoverAnchor.nativeElement.click();

                focusFixture.detectChanges();
                tick();

                expect(document.activeElement.classList).toContain('input', 'Ensure input is focused');
            })
        );

        it(
            'should not focus the initial element if autoFocus is false',
            fakeAsync(() => {
                const focusFixture = TestBed.createComponent(FocusPopoverTestComponent);
                const focusComp = focusFixture.componentInstance;

                focusFixture.detectChanges();
                focusComp.defaultPopoverAnchor.nativeElement.focus();
                focusComp.notAutoFocusedPopoverAnchor.nativeElement.click();

                focusFixture.detectChanges();
                tick();

                expect(document.activeElement).toEqual(focusComp.defaultPopoverAnchor.nativeElement);
            })
        );
    });

    describe('positioning', () => {
        let fixture: ComponentFixture<PositioningTestComponent>;
        let comp: PositioningTestComponent;
        let overlayContainerElement: HTMLElement;
        let overlay: () => OverlayRef;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PopoverModule, NoopAnimationsModule],
                declarations: [PositioningTestComponent, PositioningAliasTestComponent],
                providers: [{ provide: OverlayContainer, useFactory: overlayContainerFactory }]
            });

            fixture = TestBed.createComponent(PositioningTestComponent);
            comp = fixture.componentInstance;
            overlay = (): OverlayRef => {
                return comp.anchor._anchoring._overlayRef || <any>{};
            };

            overlayContainerElement = fixture.debugElement.injector.get(OverlayContainer).getContainerElement();
        });

        afterEach(() => {
            document.body.removeChild(overlayContainerElement);
        });

        it(
            'should keep the same overlay when positions are static',
            fakeAsync(() => {
                fixture.detectChanges();

                // open the overlay and store the overlayRef
                comp.popover.open();
                const overlayAfterFirstOpen = overlay();

                comp.popover.close();
                fixture.detectChanges();
                tick();

                // change the position to the same thing and reopen, saving the new overlayRef
                comp.hAlign = 'center';
                fixture.detectChanges();

                comp.popover.open();
                const overlayAfterSecondOpen = overlay();

                expect(overlayAfterFirstOpen === overlayAfterSecondOpen).toBe(true);
            })
        );

        it(
            'should reconstruct the overlay when positions are updated',
            fakeAsync(() => {
                fixture.detectChanges();

                // open the overlay and store the overlayRef
                comp.popover.open();
                const overlayAfterFirstOpen = overlay();

                comp.popover.close();
                fixture.detectChanges();
                tick();

                // change the position and reopen, saving the new overlayRef
                comp.hAlign = 'after';
                fixture.detectChanges();

                comp.popover.open();
                const overlayAfterSecondOpen = overlay();

                expect(overlayAfterFirstOpen === overlayAfterSecondOpen).toBe(false);
            })
        );

        it(
            'should generate the correct number of positions',
            fakeAsync(() => {
                let strategy;
                let overlayConfig;
                fixture.detectChanges();

                // centered over anchor can be any of 5 x 5 positions
                comp.popover.open();
                overlayConfig = overlay().getConfig();
                strategy = overlayConfig.positionStrategy as ConnectedPositionStrategy;
                expect(strategy.positions.length).toBe(25, 'overlapping');

                comp.popover.close();
                fixture.detectChanges();
                tick();

                // non-overlapping can be any of 2 x 2 positions
                comp.hAlign = 'after';
                comp.vAlign = 'below';
                fixture.detectChanges();

                comp.popover.open();
                overlayConfig = overlay().getConfig();
                strategy = overlayConfig.positionStrategy as ConnectedPositionStrategy;
                expect(strategy.positions.length).toBe(4, 'non-overlapping');

                comp.popover.close();
                fixture.detectChanges();
                tick();

                // overlapping in one direction can be any of 2 x 5 positions
                comp.hAlign = 'start';
                comp.vAlign = 'below';
                fixture.detectChanges();

                comp.popover.open();
                overlayConfig = overlay().getConfig();
                strategy = overlayConfig.positionStrategy as ConnectedPositionStrategy;
                expect(strategy.positions.length).toBe(10, 'overlapping in one dimension');
            })
        );

        it('should throw an error when an invalid horizontalAlign is provided', () => {
            fixture.detectChanges();

            // set invalid horizontalAlign
            comp.hAlign = 'kiwi';

            expect(() => {
                fixture.detectChanges();
            }).toThrow(getInvalidHorizontalAlignError('kiwi'));
        });

        it('should throw an error when an invalid verticalAlign is provided', () => {
            fixture.detectChanges();

            // set invalid verticalAlign
            comp.vAlign = 'banana';

            expect(() => {
                fixture.detectChanges();
            }).toThrow(getInvalidVerticalAlignError('banana'));
        });

        it('should allow aliases for horizontal and vertical align inputs', () => {
            const aliasFixture = TestBed.createComponent(PositioningAliasTestComponent);
            const aliasComp = aliasFixture.componentInstance;

            aliasComp.xAlign = 'before';
            aliasComp.yAlign = 'end';

            aliasFixture.detectChanges();

            expect(aliasComp.popover.horizontalAlign).toBe('before');
            expect(aliasComp.popover.verticalAlign).toBe('end');
        });

        it('should only generate one position when force aligned', () => {
            comp.forceAlignment = true;
            fixture.detectChanges();

            comp.popover.open();
            const overlayConfig = overlay().getConfig();
            const strategy = overlayConfig.positionStrategy as ConnectedPositionStrategy;
            expect(strategy.positions.length).toBe(1, 'only one position');
        });

        it(
            'should lock the position when alignment is locked',
            fakeAsync(() => {
                // Note: this test relies on the internal logic of the ConnectedPositionStrategy
                // and is very brittle. At @angular/cdk@^6.0.0-rc.0, the ConnectedPositionStrategy
                // internally offloads logic to FlexibleConnectedPositionStrategy. Thus, we use
                // the `strategy._positionStrategy` to get its internal instance of the FCPS.

                fixture.detectChanges();

                // Open the popover to get a spy on its position strategy
                comp.popover.open();
                tick();
                const firstOverlayConfig = overlay().getConfig();
                const firstStrategy = firstOverlayConfig.positionStrategy as ConnectedPositionStrategy;
                const firstSpy = spyOn(firstStrategy, 'recalculateLastPosition');

                // Emulate scrolling by calling apply. Assert the last position is not used when doing so.
                expect(firstSpy).not.toHaveBeenCalled();
                firstStrategy.apply();
                expect(firstSpy).not.toHaveBeenCalled();

                // Close the popover and try again with `lockAlignment`
                comp.popover.close();
                fixture.detectChanges();
                tick();

                comp.lockAlignment = true;
                fixture.detectChanges();

                // Open the popover to get a spy on its position strategy
                comp.popover.open();
                tick();
                const secondOverlayConfig = overlay().getConfig();
                const secondStrategy = secondOverlayConfig.positionStrategy as ConnectedPositionStrategy;
                const secondSpy = spyOn(secondStrategy, 'recalculateLastPosition');

                // Assert that the strategy is new
                expect(firstStrategy).not.toBe(secondStrategy);

                // Emulate scrolling agin. Assert the last position is used.
                expect(secondSpy).not.toHaveBeenCalled();
                secondStrategy.apply();
                expect(secondSpy).toHaveBeenCalled();
            })
        );
    });

    describe('scrolling', () => {
        let fixture: ComponentFixture<ScrollingTestComponent>;
        let comp: ScrollingTestComponent;
        let overlayContainerElement: HTMLElement;
        let overlay: () => OverlayRef;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PopoverModule, NoopAnimationsModule],
                declarations: [ScrollingTestComponent],
                providers: [{ provide: OverlayContainer, useFactory: overlayContainerFactory }]
            });

            fixture = TestBed.createComponent(ScrollingTestComponent);
            comp = fixture.componentInstance;
            overlay = (): OverlayRef => {
                return comp.anchor._anchoring._overlayRef || <any>{};
            };

            overlayContainerElement = fixture.debugElement.injector.get(OverlayContainer).getContainerElement();
        });

        afterEach(() => {
            document.body.removeChild(overlayContainerElement);
        });

        it(
            'should allow changing the strategy dynamically',
            fakeAsync(() => {
                let strategy;
                fixture.detectChanges();
                comp.popover.open();

                strategy = overlay().getConfig().scrollStrategy;
                expect(strategy instanceof RepositionScrollStrategy).toBe(true, 'reposition strategy');

                comp.popover.close();
                fixture.detectChanges();
                tick();

                comp.strategy = 'block';
                fixture.detectChanges();
                comp.popover.open();

                strategy = overlay().getConfig().scrollStrategy;
                expect(strategy instanceof BlockScrollStrategy).toBe(true, 'block strategy');
            })
        );

        it(
            'should wait until the popover is closed to update the strategy',
            fakeAsync(() => {
                let strategy;
                fixture.detectChanges();
                comp.popover.open();

                // expect it to be open with default strategy
                strategy = overlay().getConfig().scrollStrategy;
                expect(strategy instanceof RepositionScrollStrategy).toBe(true, 'reposition strategy');
                expect(overlayContainerElement.textContent).toContain('Popover', 'initially open');

                // change the strategy while it is open
                comp.strategy = 'block';
                fixture.detectChanges();
                tick();

                // expect it to have remained open with default strategy
                strategy = overlay().getConfig().scrollStrategy;
                expect(strategy instanceof RepositionScrollStrategy).toBe(true, 'still reposition strategy');
                expect(overlayContainerElement.textContent).toContain('Popover', 'Still open');

                // close the popover and reopen
                comp.popover.close();
                fixture.detectChanges();
                tick();
                comp.popover.open();

                // expect the new strategy to be in place
                strategy = overlay().getConfig().scrollStrategy;
                expect(strategy instanceof BlockScrollStrategy).toBe(true, 'block strategy');
            })
        );

        it('should throw an error when an invalid scrollStrategy is provided', () => {
            fixture.detectChanges();

            // set invalid scrollStrategy
            comp.strategy = 'rambutan';

            expect(() => {
                fixture.detectChanges();
            }).toThrow(getInvalidScrollStrategyError('rambutan'));
        });
    });
});

/**
 * This component is for testing that passing an invalid popover
 * to an anchor will throw an error.
 */
@Component({
    template: `
    <div [hcPopover]="invalid">Anchor</div>
    <div #invalid>Dummy</div>
  `
})
class InvalidPopoverTestComponent {}

/**
 * This component is for testing that trying to open/close/toggle
 * a popover with no anchor will throw an error.
 */
@Component({
    template: `
    <hc-popover-content horizontalAlign="after">Anchorless</hc-popover-content>
  `
})
class AnchorlessPopoverTestComponent {
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
}

/**
 * This component is for testing the default behavior of a simple
 * popover attached to a simple anchor.
 */
@Component({
    template: `
    <div [hcPopover]="p">Anchor</div>
    <hc-popover-content #p>Popover</hc-popover-content>
  `
})
class SimplePopoverTestComponent {
    @ViewChild(PopoverDirective) anchor: PopoverDirective;
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
}

/**
 * This component is for testing the backdrop behavior of a simple
 * popover attached to a simple anchor.
 */
@Component({
    template: `
    <div [hcPopover]="p">Anchor</div>
    <hc-popover-content #p
        [hasBackdrop]="backdrop"
        [backdropClass]="klass"
        (backdropClicked)="clicks = clicks + 1">
      Popover
    </hc-popover-content>
  `
})
class BackdropPopoverTestComponent {
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
    backdrop = false;
    clicks = 0;
    klass: string;
}

/**
 * This component is for testing behavior related to keyboard events
 * inside the popover.
 */
@Component({
    template: `
    <div [hcPopover]="p">Anchor</div>
    <hc-popover-content #p (overlayKeydown)="lastKeyCode = $event.keyCode">
      Popover
      <input type="text" class="first">
      <input type="text" class="second">
    </hc-popover-content>
  `
})
export class KeyboardPopoverTestComponent {
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
    lastKeyCode: number;
}

/**
 * This component is for testing focus behavior in the popover.
 */
@Component({
    template: `
    <button #b1 [hcPopover]="p1" (click)="p1.open()">Anchor 1</button>
    <button #b2 [hcPopover]="p2" (click)="p2.open()">Anchor 2</button>

    <hc-popover-content #p1><input type="text" class="input"></hc-popover-content>
    <hc-popover-content #p2 autoFocus="false"><input type="text" class="input"></hc-popover-content>
  `
})
export class FocusPopoverTestComponent {
    @ViewChild('b1') defaultPopoverAnchor: ElementRef;
    @ViewChild('b2') notAutoFocusedPopoverAnchor: ElementRef;
}

/** This component is for testing dynamic positioning behavior. */
@Component({
    template: `
    <div [hcPopover]="p">Anchor</div>
    <hc-popover-content #p
        [horizontalAlign]="hAlign"
        [verticalAlign]="vAlign"
        [forceAlignment]="forceAlignment"
        [lockAlignment]="lockAlignment">
      Popover
    </hc-popover-content>
  `
})
export class PositioningTestComponent {
    @ViewChild(PopoverDirective) anchor: PopoverDirective;
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
    hAlign = 'center';
    vAlign = 'center';
    forceAlignment = false;
    lockAlignment = false;
}

/** This component is for testing position aliases. */
@Component({
    template: `
    <div [hcPopover]="p">Anchor</div>
    <hc-popover-content #p [xAlign]="xAlign" [yAlign]="yAlign">
      Popover
    </hc-popover-content>
  `
})
export class PositioningAliasTestComponent {
    @ViewChild(PopoverDirective) anchor: PopoverDirective;
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
    xAlign = 'center';
    yAlign = 'center';
}

/** This component is for testing scroll behavior. */
@Component({
    template: `
    <div [hcPopover]="p">Anchor</div>
    <hc-popover-content #p [scrollStrategy]="strategy">
      Popover
    </hc-popover-content>
  `
})
export class ScrollingTestComponent {
    @ViewChild(PopoverDirective) anchor: PopoverDirective;
    @ViewChild(PopoverContentComponent) popover: PopoverContentComponent;
    strategy = 'reposition';
}

/** This factory function provides an overlay container under test control. */
const overlayContainerFactory = () => {
    const element = document.createElement('div');
    element.classList.add('cdk-overlay-container');
    document.body.appendChild(element);

    // remove body padding to keep consistent cross-browser
    document.body.style.padding = '0';
    document.body.style.margin = '0';

    return { getContainerElement: () => element };
};

/** Dispatches a keydown event from an element. From angular/material2 */
export function createKeyboardEvent(type: string, keyCode: number, target?: Element, key?: string) {
    const event = document.createEvent('KeyboardEvent') as any;
    // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
    const initEventFn = (event.initKeyEvent || event.initKeyboardEvent).bind(event);
    const originalPreventDefault = event.preventDefault;

    initEventFn(type, true, true, window, 0, 0, 0, 0, 0, keyCode);

    // Webkit Browsers don't set the keyCode when calling the init function.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        key: { get: () => key },
        target: { get: () => target }
    });

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    event.preventDefault = function() {
        Object.defineProperty(event, 'defaultPrevented', { get: () => true });
        return originalPreventDefault.apply(this, arguments);
    };

    return event;
}
