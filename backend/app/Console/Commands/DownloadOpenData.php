<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;
use ZipArchive;

class DownloadOpenData extends Command
{
    protected $signature = 'majorly:download-open-data';
    protected $description = 'Download O*NET 29.1 and CIP 2020 datasets';

    public function handle()
    {
        $storagePath = storage_path('app/opendata');
        if (!File::exists($storagePath)) {
            File::makeDirectory($storagePath, 0755, true);
        }

        $this->info("Downloading O*NET 29.1 Database...");
        // URL for O*NET 29.1 Text Format
        $onetUrl = 'https://www.onetcenter.org/dl_files/database/db_29_1_text.zip';
        $onetZip = $storagePath . '/onet.zip';

        if ($this->downloadFile($onetUrl, $onetZip)) {
            $this->info("Unzipping O*NET...");
            $this->unzip($onetZip, $storagePath . '/onet');
        }

        $this->info("Downloading CIP-SOC Crosswalk...");
        // Direct link to the CSV often changes or is behind a form, but NCES provides stable links.
        // We will use a known stable link for the 2020 CIP-SOC crosswalk.
        // Usually hosted at nces.ed.gov/ipeds/cipcode/Files/CIP2020_SOC2018_Crosswalk.csv
        // If that fails, we might need a backup. Let's try the official one.
        $cipUrl = 'https://nces.ed.gov/ipeds/cipcode/Files/CIP2020_SOC2018_Crosswalk.csv';
        $cipFile = $storagePath . '/CIP2020_SOC2018_Crosswalk.csv';

        $this->downloadFile($cipUrl, $cipFile);

        $this->info("Downloads complete. Data located in: $storagePath");
    }

    private function downloadFile($url, $path)
    {
        $this->output->write("Fetching $url ... ");
        try {
            // Using copy for simplicity with streams, or Http client
            // Http client is better for error handling
            $response = Http::timeout(120)->sink($path)->get($url);
            
            if ($response->successful()) {
                $this->output->writeln("<info>OK</info>");
                return true;
            } else {
                $this->output->writeln("<error>Failed: " . $response->status() . "</error>");
                return false;
            }
        } catch (\Exception $e) {
            $this->output->writeln("<error>Error: " . $e->getMessage() . "</error>");
            return false;
        }
    }

    private function unzip($zipFile, $extractTo)
    {
        $zip = new ZipArchive;
        if ($zip->open($zipFile) === TRUE) {
            $zip->extractTo($extractTo);
            $zip->close();
            $this->info("Extracted directly to $extractTo");
            return true;
        } else {
            $this->error("Failed to unzip $zipFile");
            return false;
        }
    }
}
