import { ToastOptions } from 'ng2-toastr/ng2-toastr';

export class CustomToastOptions extends ToastOptions {
  positionClass = 'toast-top-center';
  maxShown = 1;
}
