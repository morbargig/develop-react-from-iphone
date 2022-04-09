import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './app.css';
import { BehaviorSubject, from, map, Observable, switchMap, tap, take, of, catchError, EMPTY, forkJoin } from 'rxjs';
import firebaseConfig from './config/firebaseConfig/firebaseConfig.json';

type pdfData = { [key: string]: string }

type pdfModel<T extends pdfData = pdfData> = { data: T } & {
  language: keyof T,
}
export class FirebaseApi {
  private _firebase: firebase.app.App

  private get firebase(): firebase.app.App {
    return this._firebase || firebase.app()
  }

  private auth: firebase.auth.Auth

  initAuth = () => this.auth = this.firebase.auth()

  // setAuth = () => from(this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))?.pipe(
  //     catchError(err => { console.error(err); return EMPTY }),
  //     tap(({ user }) => (this.user = user))
  // )

  logout = (): Observable<void> => !!this.user ? from(this.auth.signOut())?.pipe(() => (this.user = null)) : of()

  signIn = () => from(this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))?.pipe(
    catchError(err => { console.error(err); return EMPTY }),
    tap(({ user }) => (this.user = user))
  )

  getFileContentType = (fileName: string) => {
    const extensionFile = fileName?.split('.')?.[fileName?.split('.')?.length - 1]
    switch (extensionFile) {
      case "323": return "text/h323";
      case "3g2": return "video/3gpp2";
      case "3gp": return "video/3gpp";
      case "3gp2": return "video/3gpp2";
      case "3gpp": return "video/3gpp";
      case "7z": return "application/x-7z-compressed";
      case "aa": return "audio/audible";
      case "aac": return "audio/aac";
      case "aaf": return "application/octet-stream";
      case "aax": return "audio/vnd.audible.aax";
      case "ac3": return "audio/ac3";
      case "aca": return "application/octet-stream";
      case "accda": return "application/msaccess.addin";
      case "accdb": return "application/msaccess";
      case "accdc": return "application/msaccess.cab";
      case "accde": return "application/msaccess";
      case "accdr": return "application/msaccess.runtime";
      case "accdt": return "application/msaccess";
      case "accdw": return "application/msaccess.webapplication";
      case "accft": return "application/msaccess.ftemplate";
      case "acx": return "application/internet-property-stream";
      case "addin": return "text/xml";
      case "ade": return "application/msaccess";
      case "adobebridge": return "application/x-bridge-url";
      case "adp": return "application/msaccess";
      case "adt": return "audio/vnd.dlna.adts";
      case "adts": return "audio/aac";
      case "afm": return "application/octet-stream";
      case "ai": return "application/postscript";
      case "aif": return "audio/x-aiff";
      case "aifc": return "audio/aiff";
      case "aiff": return "audio/aiff";
      case "air": return "application/vnd.adobe.air-application-installer-package+zip";
      case "amc": return "application/x-mpeg";
      case "application": return "application/x-ms-application";
      case "art": return "image/x-jg";
      case "asa": return "application/xml";
      case "asax": return "application/xml";
      case "ascx": return "application/xml";
      case "asd": return "application/octet-stream";
      case "asf": return "video/x-ms-asf";
      case "ashx": return "application/xml";
      case "asi": return "application/octet-stream";
      case "asm": return "text/plain";
      case "asmx": return "application/xml";
      case "aspx": return "application/xml";
      case "asr": return "video/x-ms-asf";
      case "asx": return "video/x-ms-asf";
      case "atom": return "application/atom+xml";
      case "au": return "audio/basic";
      case "avi": return "video/x-msvideo";
      case "axs": return "application/olescript";
      case "bas": return "text/plain";
      case "bcpio": return "application/x-bcpio";
      case "bin": return "application/octet-stream";
      case "bmp": return "image/bmp";
      case "c": return "text/plain";
      case "cab": return "application/octet-stream";
      case "caf": return "audio/x-caf";
      case "calx": return "application/vnd.ms-office.calx";
      case "cat": return "application/vnd.ms-pki.seccat";
      case "cc": return "text/plain";
      case "cd": return "text/plain";
      case "cdda": return "audio/aiff";
      case "cdf": return "application/x-cdf";
      case "cer": return "application/x-x509-ca-cert";
      case "chm": return "application/octet-stream";
      case "class": return "application/x-java-applet";
      case "clp": return "application/x-msclip";
      case "cmx": return "image/x-cmx";
      case "cnf": return "text/plain";
      case "cod": return "image/cis-cod";
      case "config": return "application/xml";
      case "contact": return "text/x-ms-contact";
      case "coverage": return "application/xml";
      case "cpio": return "application/x-cpio";
      case "cpp": return "text/plain";
      case "crd": return "application/x-mscardfile";
      case "crl": return "application/pkix-crl";
      case "crt": return "application/x-x509-ca-cert";
      case "cs": return "text/plain";
      case "csdproj": return "text/plain";
      case "csh": return "application/x-csh";
      case "csproj": return "text/plain";
      case "css": return "text/css";
      case "csv": return "text/csv";
      case "cur": return "application/octet-stream";
      case "cxx": return "text/plain";
      case "dat": return "application/octet-stream";
      case "datasource": return "application/xml";
      case "dbproj": return "text/plain";
      case "dcr": return "application/x-director";
      case "def": return "text/plain";
      case "deploy": return "application/octet-stream";
      case "der": return "application/x-x509-ca-cert";
      case "dgml": return "application/xml";
      case "dib": return "image/bmp";
      case "dif": return "video/x-dv";
      case "dir": return "application/x-director";
      case "disco": return "text/xml";
      case "dll": return "application/x-msdownload";
      case "dll.config": return "text/xml";
      case "dlm": return "text/dlm";
      case "doc": return "application/msword";
      case "docm": return "application/vnd.ms-word.document.macroenabled.12";
      case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "dot": return "application/msword";
      case "dotm": return "application/vnd.ms-word.template.macroenabled.12";
      case "dotx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
      case "dsp": return "application/octet-stream";
      case "dsw": return "text/plain";
      case "dtd": return "text/xml";
      case "dtsconfig": return "text/xml";
      case "dv": return "video/x-dv";
      case "dvi": return "application/x-dvi";
      case "dwf": return "drawing/x-dwf";
      case "dwp": return "application/octet-stream";
      case "dxr": return "application/x-director";
      case "eml": return "message/rfc822";
      case "emz": return "application/octet-stream";
      case "eot": return "application/octet-stream";
      case "eps": return "application/postscript";
      case "etl": return "application/etl";
      case "etx": return "text/x-setext";
      case "evy": return "application/envoy";
      case "exe": return "application/octet-stream";
      case "exe.config": return "text/xml";
      case "fdf": return "application/vnd.fdf";
      case "fif": return "application/fractals";
      case "filters": return "application/xml";
      case "fla": return "application/octet-stream";
      case "flr": return "x-world/x-vrml";
      case "flv": return "video/x-flv";
      case "fsscript": return "application/fsharp-script";
      case "fsx": return "application/fsharp-script";
      case "generictest": return "application/xml";
      case "gif": return "image/gif";
      case "group": return "text/x-ms-group";
      case "gsm": return "audio/x-gsm";
      case "gtar": return "application/x-gtar";
      case "gz": return "application/x-gzip";
      case "h": return "text/plain";
      case "hdf": return "application/x-hdf";
      case "hdml": return "text/x-hdml";
      case "hhc": return "application/x-oleobject";
      case "hhk": return "application/octet-stream";
      case "hhp": return "application/octet-stream";
      case "hlp": return "application/winhlp";
      case "hpp": return "text/plain";
      case "hqx": return "application/mac-binhex40";
      case "hta": return "application/hta";
      case "htc": return "text/x-component";
      case "htm": return "text/html";
      case "html": return "text/html";
      case "htt": return "text/webviewhtml";
      case "hxa": return "application/xml";
      case "hxc": return "application/xml";
      case "hxd": return "application/octet-stream";
      case "hxe": return "application/xml";
      case "hxf": return "application/xml";
      case "hxh": return "application/octet-stream";
      case "hxi": return "application/octet-stream";
      case "hxk": return "application/xml";
      case "hxq": return "application/octet-stream";
      case "hxr": return "application/octet-stream";
      case "hxs": return "application/octet-stream";
      case "hxt": return "text/html";
      case "hxv": return "application/xml";
      case "hxw": return "application/octet-stream";
      case "hxx": return "text/plain";
      case "i": return "text/plain";
      case "ico": return "image/x-icon";
      case "ics": return "application/octet-stream";
      case "idl": return "text/plain";
      case "ief": return "image/ief";
      case "iii": return "application/x-iphone";
      case "inc": return "text/plain";
      case "inf": return "application/octet-stream";
      case "inl": return "text/plain";
      case "ins": return "application/x-internet-signup";
      case "ipa": return "application/x-itunes-ipa";
      case "ipg": return "application/x-itunes-ipg";
      case "ipproj": return "text/plain";
      case "ipsw": return "application/x-itunes-ipsw";
      case "iqy": return "text/x-ms-iqy";
      case "isp": return "application/x-internet-signup";
      case "ite": return "application/x-itunes-ite";
      case "itlp": return "application/x-itunes-itlp";
      case "itms": return "application/x-itunes-itms";
      case "itpc": return "application/x-itunes-itpc";
      case "ivf": return "video/x-ivf";
      case "jar": return "application/java-archive";
      case "java": return "application/octet-stream";
      case "jck": return "application/liquidmotion";
      case "jcz": return "application/liquidmotion";
      case "jfif": return "image/pjpeg";
      case "jnlp": return "application/x-java-jnlp-file";
      case "jpb": return "application/octet-stream";
      case "jpe": return "image/jpeg";
      case "jpeg": return "image/jpeg";
      case "jpg": return "image/jpeg";
      case "js": return "application/x-javascript";
      case "jsx": return "text/jscript";
      case "jsxbin": return "text/plain";
      case "latex": return "application/x-latex";
      case "library-ms": return "application/windows-library+xml";
      case "lit": return "application/x-ms-reader";
      case "loadtest": return "application/xml";
      case "lpk": return "application/octet-stream";
      case "lsf": return "video/x-la-asf";
      case "lst": return "text/plain";
      case "lsx": return "video/x-la-asf";
      case "lzh": return "application/octet-stream";
      case "m13": return "application/x-msmediaview";
      case "m14": return "application/x-msmediaview";
      case "m1v": return "video/mpeg";
      case "m2t": return "video/vnd.dlna.mpeg-tts";
      case "m2ts": return "video/vnd.dlna.mpeg-tts";
      case "m2v": return "video/mpeg";
      case "m3u": return "audio/x-mpegurl";
      case "m3u8": return "audio/x-mpegurl";
      case "m4a": return "audio/m4a";
      case "m4b": return "audio/m4b";
      case "m4p": return "audio/m4p";
      case "m4r": return "audio/x-m4r";
      case "m4v": return "video/x-m4v";
      case "mac": return "image/x-macpaint";
      case "mak": return "text/plain";
      case "man": return "application/x-troff-man";
      case "manifest": return "application/x-ms-manifest";
      case "map": return "text/plain";
      case "master": return "application/xml";
      case "mda": return "application/msaccess";
      case "mdb": return "application/x-msaccess";
      case "mde": return "application/msaccess";
      case "mdp": return "application/octet-stream";
      case "me": return "application/x-troff-me";
      case "mfp": return "application/x-shockwave-flash";
      case "mht": return "message/rfc822";
      case "mhtml": return "message/rfc822";
      case "mid": return "audio/mid";
      case "midi": return "audio/mid";
      case "mix": return "application/octet-stream";
      case "mk": return "text/plain";
      case "mmf": return "application/x-smaf";
      case "mno": return "text/xml";
      case "mny": return "application/x-msmoney";
      case "mod": return "video/mpeg";
      case "mov": return "video/quicktime";
      case "movie": return "video/x-sgi-movie";
      case "mp2": return "video/mpeg";
      case "mp2v": return "video/mpeg";
      case "mp3": return "audio/mpeg";
      case "mp4": return "video/mp4";
      case "mp4v": return "video/mp4";
      case "mpa": return "video/mpeg";
      case "mpe": return "video/mpeg";
      case "mpeg": return "video/mpeg";
      case "mpf": return "application/vnd.ms-mediapackage";
      case "mpg": return "video/mpeg";
      case "mpp": return "application/vnd.ms-project";
      case "mpv2": return "video/mpeg";
      case "mqv": return "video/quicktime";
      case "ms": return "application/x-troff-ms";
      case "msi": return "application/octet-stream";
      case "mso": return "application/octet-stream";
      case "mts": return "video/vnd.dlna.mpeg-tts";
      case "mtx": return "application/xml";
      case "mvb": return "application/x-msmediaview";
      case "mvc": return "application/x-miva-compiled";
      case "mxp": return "application/x-mmxp";
      case "nc": return "application/x-netcdf";
      case "nsc": return "video/x-ms-asf";
      case "nws": return "message/rfc822";
      case "ocx": return "application/octet-stream";
      case "oda": return "application/oda";
      case "odc": return "text/x-ms-odc";
      case "odh": return "text/plain";
      case "odl": return "text/plain";
      case "odp": return "application/vnd.oasis.opendocument.presentation";
      case "ods": return "application/oleobject";
      case "odt": return "application/vnd.oasis.opendocument.text";
      case "one": return "application/onenote";
      case "onea": return "application/onenote";
      case "onepkg": return "application/onenote";
      case "onetmp": return "application/onenote";
      case "onetoc": return "application/onenote";
      case "onetoc2": return "application/onenote";
      case "orderedtest": return "application/xml";
      case "osdx": return "application/opensearchdescription+xml";
      case "p10": return "application/pkcs10";
      case "p12": return "application/x-pkcs12";
      case "p7b": return "application/x-pkcs7-certificates";
      case "p7c": return "application/pkcs7-mime";
      case "p7m": return "application/pkcs7-mime";
      case "p7r": return "application/x-pkcs7-certreqresp";
      case "p7s": return "application/pkcs7-signature";
      case "pbm": return "image/x-portable-bitmap";
      case "pcast": return "application/x-podcast";
      case "pct": return "image/pict";
      case "pcx": return "application/octet-stream";
      case "pcz": return "application/octet-stream";
      case "pdf": return "application/pdf";
      case "pfb": return "application/octet-stream";
      case "pfm": return "application/octet-stream";
      case "pfx": return "application/x-pkcs12";
      case "pgm": return "image/x-portable-graymap";
      case "pic": return "image/pict";
      case "pict": return "image/pict";
      case "pkgdef": return "text/plain";
      case "pkgundef": return "text/plain";
      case "pko": return "application/vnd.ms-pki.pko";
      case "pls": return "audio/scpls";
      case "pma": return "application/x-perfmon";
      case "pmc": return "application/x-perfmon";
      case "pml": return "application/x-perfmon";
      case "pmr": return "application/x-perfmon";
      case "pmw": return "application/x-perfmon";
      case "png": return "image/png";
      case "pnm": return "image/x-portable-anymap";
      case "pnt": return "image/x-macpaint";
      case "pntg": return "image/x-macpaint";
      case "pnz": return "image/png";
      case "pot": return "application/vnd.ms-powerpoint";
      case "potm": return "application/vnd.ms-powerpoint.template.macroenabled.12";
      case "potx": return "application/vnd.openxmlformats-officedocument.presentationml.template";
      case "ppa": return "application/vnd.ms-powerpoint";
      case "ppam": return "application/vnd.ms-powerpoint.addin.macroenabled.12";
      case "ppm": return "image/x-portable-pixmap";
      case "pps": return "application/vnd.ms-powerpoint";
      case "ppsm": return "application/vnd.ms-powerpoint.slideshow.macroenabled.12";
      case "ppsx": return "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
      case "ppt": return "application/vnd.ms-powerpoint";
      case "pptm": return "application/vnd.ms-powerpoint.presentation.macroenabled.12";
      case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "prf": return "application/pics-rules";
      case "prm": return "application/octet-stream";
      case "prx": return "application/octet-stream";
      case "ps": return "application/postscript";
      case "psc1": return "application/powershell";
      case "psd": return "application/octet-stream";
      case "psess": return "application/xml";
      case "psm": return "application/octet-stream";
      case "psp": return "application/octet-stream";
      case "pub": return "application/x-mspublisher";
      case "pwz": return "application/vnd.ms-powerpoint";
      case "qht": return "text/x-html-insertion";
      case "qhtm": return "text/x-html-insertion";
      case "qt": return "video/quicktime";
      case "qti": return "image/x-quicktime";
      case "qtif": return "image/x-quicktime";
      case "qtl": return "application/x-quicktimeplayer";
      case "qxd": return "application/octet-stream";
      case "ra": return "audio/x-pn-realaudio";
      case "ram": return "audio/x-pn-realaudio";
      case "rar": return "application/octet-stream";
      case "ras": return "image/x-cmu-raster";
      case "rat": return "application/rat-file";
      case "rc": return "text/plain";
      case "rc2": return "text/plain";
      case "rct": return "text/plain";
      case "rdlc": return "application/xml";
      case "resx": return "application/xml";
      case "rf": return "image/vnd.rn-realflash";
      case "rgb": return "image/x-rgb";
      case "rgs": return "text/plain";
      case "rm": return "application/vnd.rn-realmedia";
      case "rmi": return "audio/mid";
      case "rmp": return "application/vnd.rn-rn_music_package";
      case "roff": return "application/x-troff";
      case "rpm": return "audio/x-pn-realaudio-plugin";
      case "rqy": return "text/x-ms-rqy";
      case "rtf": return "application/rtf";
      case "rtx": return "text/richtext";
      case "ruleset": return "application/xml";
      case "s": return "text/plain";
      case "safariextz": return "application/x-safari-safariextz";
      case "scd": return "application/x-msschedule";
      case "sct": return "text/scriptlet";
      case "sd2": return "audio/x-sd2";
      case "sdp": return "application/sdp";
      case "sea": return "application/octet-stream";
      case "searchconnector-ms": return "application/windows-search-connector+xml";
      case "setpay": return "application/set-payment-initiation";
      case "setreg": return "application/set-registration-initiation";
      case "settings": return "application/xml";
      case "sgimb": return "application/x-sgimb";
      case "sgml": return "text/sgml";
      case "sh": return "application/x-sh";
      case "shar": return "application/x-shar";
      case "shtml": return "text/html";
      case "sit": return "application/x-stuffit";
      case "sitemap": return "application/xml";
      case "skin": return "application/xml";
      case "sldm": return "application/vnd.ms-powerpoint.slide.macroenabled.12";
      case "sldx": return "application/vnd.openxmlformats-officedocument.presentationml.slide";
      case "slk": return "application/vnd.ms-excel";
      case "sln": return "text/plain";
      case "slupkg-ms": return "application/x-ms-license";
      case "smd": return "audio/x-smd";
      case "smi": return "application/octet-stream";
      case "smx": return "audio/x-smd";
      case "smz": return "audio/x-smd";
      case "snd": return "audio/basic";
      case "snippet": return "application/xml";
      case "snp": return "application/octet-stream";
      case "sol": return "text/plain";
      case "sor": return "text/plain";
      case "spc": return "application/x-pkcs7-certificates";
      case "spl": return "application/futuresplash";
      case "src": return "application/x-wais-source";
      case "srf": return "text/plain";
      case "ssisdeploymentmanifest": return "text/xml";
      case "ssm": return "application/streamingmedia";
      case "sst": return "application/vnd.ms-pki.certstore";
      case "stl": return "application/vnd.ms-pki.stl";
      case "sv4cpio": return "application/x-sv4cpio";
      case "sv4crc": return "application/x-sv4crc";
      case "svc": return "application/xml";
      case "swf": return "application/x-shockwave-flash";
      case "t": return "application/x-troff";
      case "tar": return "application/x-tar";
      case "tcl": return "application/x-tcl";
      case "testrunconfig": return "application/xml";
      case "testsettings": return "application/xml";
      case "tex": return "application/x-tex";
      case "texi": return "application/x-texinfo";
      case "texinfo": return "application/x-texinfo";
      case "tgz": return "application/x-compressed";
      case "thmx": return "application/vnd.ms-officetheme";
      case "thn": return "application/octet-stream";
      case "tif": return "image/tiff";
      case "tiff": return "image/tiff";
      case "tlh": return "text/plain";
      case "tli": return "text/plain";
      case "toc": return "application/octet-stream";
      case "tr": return "application/x-troff";
      case "trm": return "application/x-msterminal";
      case "trx": return "application/xml";
      case "ts": return "video/vnd.dlna.mpeg-tts";
      case "tsv": return "text/tab-separated-values";
      case "ttf": return "application/octet-stream";
      case "tts": return "video/vnd.dlna.mpeg-tts";
      case "txt": return "text/plain";
      case "u32": return "application/octet-stream";
      case "uls": return "text/iuls";
      case "user": return "text/plain";
      case "ustar": return "application/x-ustar";
      case "vb": return "text/plain";
      case "vbdproj": return "text/plain";
      case "vbk": return "video/mpeg";
      case "vbproj": return "text/plain";
      case "vbs": return "text/vbscript";
      case "vcf": return "text/x-vcard";
      case "vcproj": return "application/xml";
      case "vcs": return "text/plain";
      case "vcxproj": return "application/xml";
      case "vddproj": return "text/plain";
      case "vdp": return "text/plain";
      case "vdproj": return "text/plain";
      case "vdx": return "application/vnd.ms-visio.viewer";
      case "vml": return "text/xml";
      case "vscontent": return "application/xml";
      case "vsct": return "text/xml";
      case "vsd": return "application/vnd.visio";
      case "vsi": return "application/ms-vsi";
      case "vsix": return "application/vsix";
      case "vsixlangpack": return "text/xml";
      case "vsixmanifest": return "text/xml";
      case "vsmdi": return "application/xml";
      case "vspscc": return "text/plain";
      case "vss": return "application/vnd.visio";
      case "vsscc": return "text/plain";
      case "vssettings": return "text/xml";
      case "vssscc": return "text/plain";
      case "vst": return "application/vnd.visio";
      case "vstemplate": return "text/xml";
      case "vsto": return "application/x-ms-vsto";
      case "vsw": return "application/vnd.visio";
      case "vsx": return "application/vnd.visio";
      case "vtx": return "application/vnd.visio";
      case "wav": return "audio/wav";
      case "wave": return "audio/wav";
      case "wax": return "audio/x-ms-wax";
      case "wbk": return "application/msword";
      case "wbmp": return "image/vnd.wap.wbmp";
      case "wcm": return "application/vnd.ms-works";
      case "wdb": return "application/vnd.ms-works";
      case "wdp": return "image/vnd.ms-photo";
      case "webarchive": return "application/x-safari-webarchive";
      case "webtest": return "application/xml";
      case "wiq": return "application/xml";
      case "wiz": return "application/msword";
      case "wks": return "application/vnd.ms-works";
      case "wlmp": return "application/wlmoviemaker";
      case "wlpginstall": return "application/x-wlpg-detect";
      case "wlpginstall3": return "application/x-wlpg3-detect";
      case "wm": return "video/x-ms-wm";
      case "wma": return "audio/x-ms-wma";
      case "wmd": return "application/x-ms-wmd";
      case "wmf": return "application/x-msmetafile";
      case "wml": return "text/vnd.wap.wml";
      case "wmlc": return "application/vnd.wap.wmlc";
      case "wmls": return "text/vnd.wap.wmlscript";
      case "wmlsc": return "application/vnd.wap.wmlscriptc";
      case "wmp": return "video/x-ms-wmp";
      case "wmv": return "video/x-ms-wmv";
      case "wmx": return "video/x-ms-wmx";
      case "wmz": return "application/x-ms-wmz";
      case "wpl": return "application/vnd.ms-wpl";
      case "wps": return "application/vnd.ms-works";
      case "wri": return "application/x-mswrite";
      case "wrl": return "x-world/x-vrml";
      case "wrz": return "x-world/x-vrml";
      case "wsc": return "text/scriptlet";
      case "wsdl": return "text/xml";
      case "wvx": return "video/x-ms-wvx";
      case "x": return "application/directx";
      case "xaf": return "x-world/x-vrml";
      case "xaml": return "application/xaml+xml";
      case "xap": return "application/x-silverlight-app";
      case "xbap": return "application/x-ms-xbap";
      case "xbm": return "image/x-xbitmap";
      case "xdr": return "text/plain";
      case "xht": return "application/xhtml+xml";
      case "xhtml": return "application/xhtml+xml";
      case "xla": return "application/vnd.ms-excel";
      case "xlam": return "application/vnd.ms-excel.addin.macroenabled.12";
      case "xlc": return "application/vnd.ms-excel";
      case "xld": return "application/vnd.ms-excel";
      case "xlk": return "application/vnd.ms-excel";
      case "xll": return "application/vnd.ms-excel";
      case "xlm": return "application/vnd.ms-excel";
      case "xls": return "application/vnd.ms-excel";
      case "xlsb": return "application/vnd.ms-excel.sheet.binary.macroenabled.12";
      case "xlsm": return "application/vnd.ms-excel.sheet.macroenabled.12";
      case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "xlt": return "application/vnd.ms-excel";
      case "xltm": return "application/vnd.ms-excel.template.macroenabled.12";
      case "xltx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
      case "xlw": return "application/vnd.ms-excel";
      case "xml": return "text/xml";
      case "xmta": return "application/xml";
      case "xof": return "x-world/x-vrml";
      case "xoml": return "text/plain";
      case "xpm": return "image/x-xpixmap";
      case "xps": return "application/vnd.ms-xpsdocument";
      case "xrm-ms": return "text/xml";
      case "xsc": return "application/xml";
      case "xsd": return "text/xml";
      case "xsf": return "text/xml";
      case "xsl": return "text/xml";
      case "xslt": return "text/xml";
      case "xsn": return "application/octet-stream";
      case "xss": return "application/xml";
      case "xtp": return "application/octet-stream";
      case "xwd": return "image/x-xwindowdump";
      case "z": return "application/x-compress";
      case "zip": return "application/x-zip-compressed";
    }
  }

  private get username(): string { return this.user?.uid || this.adminUserName }
  private user?: firebase.User
  private adminUserName: string = 'Hyr14QJ2wHPrMPsurzVP5yumse12'
  public pdf?: pdfModel
  public pdfChanged: BehaviorSubject<pdfModel> = new BehaviorSubject<pdfModel>(null)
  public authStateChanged: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null)

  constructor() {
    !firebase.apps.length &&
      (this._firebase = firebase.initializeApp(firebaseConfig));
    this.initAuth()
    this.onAuthStateChanged((u) => (this.user = u) || this.authStateChanged?.next(u))
  }

  public get keys(): (keyof pdfModel['data'])[] {
    const keys = Object.keys(this.pdf?.data || {})
    if (Object.keys(this.pdf || {})?.length) {
      return keys as (keyof pdfModel['data'])[]
    }
    firebase.database()
    return []
  }

  private onAuthStateChanged = (nextOrObserver: | firebase.Observer<any> | ((a: firebase.User | null) => any),
    error?: (a: firebase.auth.Error) => any,
    completed?: firebase.Unsubscribe) => this.auth.onAuthStateChanged(nextOrObserver, error, completed)

  newPdf = (): Observable<pdfModel> =>
    from(this.firebase.database().ref(`CV/${this.username}/`).set({
      language: 'englishFile', data: {
        hebrewFile: '',
        englishFile: '',
        linkedinFile: '',
      }
    } as pdfModel))

  updatePdfState = (pdf: pdfModel) => {
    const handleChanges = (pdf: pdfModel) => {
      this.pdf = pdf;
      this.pdfChanged.next(pdf);
    }
    if (!pdf) {
      const s = this.newPdf()?.pipe(take(1))?.subscribe((pdf) => {
        s?.unsubscribe()
        handleChanges(pdf)
      })
    } else {
      handleChanges(pdf)
    }

  }

  login = () => this.firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())

  getPdf = (): Observable<pdfModel> =>
    from(this.firebase.database().ref(`CV/${this.username}/`).once('value'))?.pipe(map(snap => snap?.val()), tap(this.updatePdfState))

  uploadPdf = (uploadedImage: (Blob | Uint8Array | ArrayBuffer), fileName: string, fileTypeName?: keyof pdfModel['data']): Observable<string> => {
    const storageRef = this.firebase.storage().ref();
    const fileRef = storageRef
      .child(`/CV/${this.username}/${fileName}`);
    return from(fileRef.put(uploadedImage, { contentType: this.getFileContentType(fileName) }))?.pipe(switchMap(uploadTaskSnapshot => from(uploadTaskSnapshot.ref.getDownloadURL())))?.pipe(
      tap(url => this.updatePdf(
        {
          ...this.pdf, data: { ...this.pdf?.data, [fileTypeName || (this.pdf as any).language]: url }
        }).toPromise()),
    )
  }

  updatePdf = (upData: any): any =>
    from(this.firebase.database().ref(`CV/${this.username}/`).once('value')).pipe(switchMap(snap =>
      from(this.firebase.database().ref(`CV/${this.username}`).set({ ...snap.val(), ...upData } as pdfModel))?.pipe(tap(() => this.updatePdfState({ ...snap.val(), ...upData })))
    ))

  deleteFile = (url: string) => from(this.firebase.storage().refFromURL(url)?.delete())

  deletePdf = (deletePdfKey: keyof pdfModel['data']): any => {
    const { pdf: pdfSnapshot } = this
    if (!!deletePdfKey && !!pdfSnapshot?.data?.[deletePdfKey]) {
      this.deleteFile(pdfSnapshot?.data?.[deletePdfKey] || '')
      delete pdfSnapshot?.data?.[deletePdfKey]
      pdfSnapshot.language = Object?.keys(pdfSnapshot?.data || {})?.[0] as keyof pdfModel['data']
      return from(this.firebase.database().ref(`CV/${this.username}`).set(pdfSnapshot as pdfModel))?.pipe(tap(() => this.pdf = pdfSnapshot))
    }
  }
}

enum actionEnum {
  Delete,
  Edit
}

export default function App() {
  const isMobile = (function (a) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
  })(navigator.userAgent || navigator.vendor || (window as any)?.opera)
  const firebaseApi = new FirebaseApi()
  const defaultFile = 'https://firebasestorage.googleapis.com/v0/b/morbargig-a81d2.appspot.com/o/CV%2Fno-photo-available.png?alt=media&token=27b382af-7a35-4551-ade9-5edb5271df6b'
  const [fileUri, setFileUri] = useState(defaultFile)
  const [cvName, setCvName] = useState('')
  // const [subscribes, setSubscribes] = React.useState([] as Subscription[])
  // const [ended, setEnded] = React.useState(false)
  // // stops all subscribes (by ended property) and unsubscribe them
  // const destroy = () => {
  //   setEnded(true)
  //   subscribes?.forEach(x => x?.unsubscribe())
  // }

  useEffect(() => {
    firebaseApi.updatePdfState(null)
    const s = forkJoin([
      firebaseApi.pdfChanged?.pipe(tap(pdf => {
        const fileUri = pdf?.data?.[cvName]?.split('&token')?.[0];
        !!fileUri && setFileUri(oldVal => fileUri || oldVal);
        setCvName(pdf?.language?.toString())
      })),
      // firebaseApi.getPdf()?.pipe(take(1), tap(cvName => {
      //   setCvName(cvName?.language?.toString())
      // })),
    ]).subscribe()
    return () => s?.unsubscribe()
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const onValueChange = (getValFunc: () => actionEnum) => {
    const actionType = getValFunc()
    switch (actionType) {
      case actionEnum.Delete:
        firebaseApi?.deletePdf(cvName)
        break;
      case actionEnum.Edit:
      // of()?.toPromise()?.then(file => {
      //   const { type } = file
      //   if (type === 'cancel') {
      //     return;
      //   }
      //   const { uri, name } = file
      //   try {
      //     axios.get(uri, { responseType: 'arraybuffer' })?.then((fetchResponse) => {
      //       // console.log('fetchResponse', fetchResponse);
      //       const uint8Array = new Uint8Array(fetchResponse?.data)
      //       const file = uint8Array
      //       const uploadedFileName = name || uri.substring(uri.lastIndexOf('/') + 1)
      //       const s = firebaseApi.uploadPdf(file, uploadedFileName, fileName as any)?.pipe(take(1))?.subscribe(() => s?.unsubscribe())
      //     })
      //   } catch (error) {
      //     console.log('ERR: ' + error);
      //   }
      // })
      default:
        break;
    }
  }
  return (<div>
    {/* {this.state.changePdf ? <div> <input type="file" onChange={this.handleImage} /> */}
    {/* <button onClick={this.handleUpload}>Upload Image</button> */}
    {/* <button onClick={this.updatePdf}>update pdf </button> */}
    {/* </div> : null} */}
    {/* <h2 className="header" > {!h ? "Mor Bargig CV" : ' מור ברגיג קו"ח'} </h2> */}
    {/* <button className={x ? "disabled" : null} name="EngPDF" style={h ? { float: 'right' } : { float: "left" }} onClick={!x ? this.getPDF : null} > {!h ? 'English' : " אנגלית"} </button> */}
    {/* <button className={h ? "disabled" : null} name="HebPDF" style={h ? { float: 'right' } : { float: "left" }} onClick={!h ? this.getPDF : null}  > {!h ? 'Hebrew' : "עברית"} </button> */}
    {/* <button className={l ? "disabled" : null} name="linkedin" style={h ? { float: 'right' } : { float: "left" }} onClick={!l ? this.getPDF : null}  > {!h ? 'linkedin' : "לינקדין"} </button> */}
    <br></br><br></br>
    <br></br><br></br>

    <div className="topnav">

      <a href="/#" onClick={() => setIsOpen(!isOpen)} className="active">Menu</a>
      {isOpen ?
        <div id="myLinks">
          <a href={fileUri} target="blank">pdf</a>
          <a href="https://5d60919cef31b.site123.me/" target="blank">My Web Site</a>
          <a href="https://github.com/morbargig?tab=repositories" target="blank">GitHub</a>
          <a href="https://www.linkedin.com/in/mor-bargig-744854182/" target="blank">LinkedIn</a>
          <a href="tel:+972 52-861-2379" target="blank"> Contact </a>
          <a href="mailto:mobargig@gmail.com" target="blank"> Email</a>
          {/* <a href="/#" onClick={this.admin} className='Admin' >Admin ?</a> */}
        </div>

        :
        <a
          className="Portfolio"
          href="https://morbargig.github.io/" target="blank" style={{ marginTop: 0 + "px" }}>
          Portfolio <span></span>
          <img src="https://firebasestorage.googleapis.com/v0/b/morbargig-a81d2.appspot.com/o/morBargigSigLogo.png?alt=media&token=f846b8e6-1096-4675-907d-2f7589ec23e8" alt="Javascript"

            style={{ borderRadius: 50 + '%', height: 12 + 'px', width: 12 + 'px' }}
          ></img>
        </a>}
    </div>
    {isMobile ?
      <div >
        <iframe title='pdf' id="pdf" name="pdf" src={fileUri} width="100%" height="600px" frameBorder="0" scrolling="yes">
          <p>It appears your web browser doesn't support iframes.</p>

        </iframe>
      </div>
      :
      <div>
        <embed
          id="pdf"
          type="application/pdf"
          src={fileUri}
          width="100%" height="1000px"
          background-color="0xFF525659"
          top-toolbar-height="56"
          full-frame=""
          title="Mor Bargig">
        </embed>
      </div>
    }
  </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    // width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    justifyContent: 'space-around'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 100,
    height: 1,
    width: '80%',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));