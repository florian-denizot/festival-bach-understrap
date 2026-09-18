import os
import sys
import shutil
import zipfile

def build_zip(source_dir, output_zip_path):
    print(f"Building zip from '{source_dir}' -> '{output_zip_path}'...")
    os.makedirs(os.path.dirname(os.path.abspath(output_zip_path)), exist_ok=True)
    
    # Remove existing zip if present
    if os.path.exists(output_zip_path):
        os.remove(output_zip_path)
        
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            dirs.sort()
            files.sort()
            
            # Add directory entries
            for d in dirs:
                full_dir = os.path.join(root, d)
                rel_dir = os.path.relpath(full_dir, source_dir).replace('\\', '/') + '/'
                zi = zipfile.ZipInfo(rel_dir)
                zi.create_system = 3  # Unix
                zi.external_attr = 0x41ff0000  # directory permissions (0777 / 0755)
                zf.writestr(zi, b'')
                
            # Add file entries
            for f in files:
                # Never include any zip inside the zip
                if f.endswith('.zip'):
                    continue
                full_file = os.path.join(root, f)
                rel_file = os.path.relpath(full_file, source_dir).replace('\\', '/')
                with open(full_file, 'rb') as fp:
                    data = fp.read()
                zi = zipfile.ZipInfo(rel_file)
                zi.create_system = 3  # Unix
                zi.external_attr = 0x81b60000  # file permissions (0666 / 0644)
                zf.writestr(zi, data)
                
    size = os.path.getsize(output_zip_path)
    print(f"Done! Created '{output_zip_path}' ({size:,} bytes).")

if __name__ == '__main__':
    version = sys.argv[1] if len(sys.argv) > 1 else '1.0.17'
    release_zip = f"releases/{version}/festival-bach-understrap.zip"
    root_zip = "festival-bach-understrap.zip"
    
    build_zip("dist", release_zip)
    print(f"Copying to root '{root_zip}'...")
    shutil.copyfile(release_zip, root_zip)
    print("Release packaging complete!")
