import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="gradient-rr" style="border-top:1px solid rgba(255,255,255,0.1)">
      <div class="container" style="padding-top:3rem;padding-bottom:3rem">
        <div style="display:flex;flex-direction:column;align-items:center;gap:1.5rem">
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem">
            <span style="font-size:14px;font-weight:700;letter-spacing:0.15em;color:#fff">ROLLS-ROYCE</span>
            <p style="font-size:12px;color:rgba(255,255,255,0.5)">MRO Variance Platform</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem">
            <p style="font-size:12px;color:rgba(255,255,255,0.4)">Trusted to deliver excellence</p>
            <p style="font-size:12px;color:rgba(255,255,255,0.3)">&copy; {{ year }} Rolls-Royce plc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
