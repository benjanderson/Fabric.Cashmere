export { PopoverModule } from './popover.module';
export { NotificationAction, PopoverNotification, PopoverNotificationService } from './notification.service';
export { PopoverDirective } from './popover-anchor.directive';
export { PopoverAnchoringService } from './popover-anchoring.service';
export { transformPopover } from './popover.animations';
export { PopoverContentComponent } from './popover.component';
export {
    getInvalidPopoverError,
    getUnanchoredPopoverError,
    getInvalidHorizontalAlignError,
    getInvalidVerticalAlignError,
    getInvalidScrollStrategyError
} from './popover.errors';
